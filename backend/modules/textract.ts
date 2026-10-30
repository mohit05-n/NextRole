import {
  TextractClient,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
  Block
} from "@aws-sdk/client-textract";
import { logger } from "../utils/logger";

const textractClient = new TextractClient({});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function extractTextFromResume(
  bucketName: string,
  key: string
): Promise<string> {
  logger.info(`Starting Textract job for S3: Bucket=${bucketName}, Key=${key}`);
  try {
    const startCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: key
        }
      }
    });

    const startResponse = await textractClient.send(startCommand);
    const jobId = startResponse.JobId;
    if (!jobId) {
      throw new Error("Failed to start Textract job: No JobId returned");
    }

    logger.info(`Textract Job started: JobId=${jobId}`);

    // Poll for the result
    let status = "IN_PROGRESS";
    let attempts = 0;
    const maxAttempts = 30; // Max 30 attempts, 1s delay
    let getResponse: any = null;

    while (status === "IN_PROGRESS" && attempts < maxAttempts) {
      attempts++;
      await sleep(1000); // Wait 1 second

      const getCommand = new GetDocumentTextDetectionCommand({
        JobId: jobId
      });
      getResponse = await textractClient.send(getCommand);
      status = getResponse.JobStatus || "IN_PROGRESS";
      logger.info(`Textract Job Status (Attempt ${attempts}): ${status}`);
    }

    if (status !== "SUCCEEDED") {
      throw new Error(`Textract job failed or timed out: Status=${status}`);
    }

    // Process blocks and collect all text
    let fullText = "";
    let nextToken = getResponse.NextToken;
    let blocks: Block[] = getResponse.Blocks || [];

    // Process initial batch of blocks
    for (const block of blocks) {
      if (block.BlockType === "LINE" && block.Text) {
        fullText += block.Text + "\n";
      }
    }

    // Retrieve paginated results if any
    while (nextToken) {
      const getCommand = new GetDocumentTextDetectionCommand({
        JobId: jobId,
        NextToken: nextToken
      });
      const paginatedResponse = await textractClient.send(getCommand);
      const paginatedBlocks: Block[] = paginatedResponse.Blocks || [];
      for (const block of paginatedBlocks) {
        if (block.BlockType === "LINE" && block.Text) {
          fullText += block.Text + "\n";
        }
      }
      nextToken = paginatedResponse.NextToken;
    }

    logger.info(`Textract extraction complete. Total characters: ${fullText.length}`);
    return fullText.trim();
  } catch (error) {
    logger.error("Textract extraction failed", error);
    throw error;
  }
}
