const {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand
} = require("@aws-sdk/client-textract");

const textractClient = new TextractClient({});

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseBlocks(blocks) {
  let text = "";
  for (const block of blocks) {
    if (block.BlockType === "LINE" && block.Text) {
      text += block.Text + "\n";
    }
  }
  return text.trim();
}

async function runAsyncTextract(bucketName, key) {
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
    throw new Error("Failed to initialize Textract async text detection.");
  }

  let status = "IN_PROGRESS";
  let attempts = 0;
  const maxAttempts = 30;
  let getResponse = null;

  while (status === "IN_PROGRESS" && attempts < maxAttempts) {
    attempts++;
    await sleep(1000);

    const getCommand = new GetDocumentTextDetectionCommand({
      JobId: jobId
    });
    getResponse = await textractClient.send(getCommand);
    status = getResponse.JobStatus || "IN_PROGRESS";
  }

  if (status !== "SUCCEEDED") {
    throw new Error(`Textract async parsing failed or timed out. Status: ${status}`);
  }

  let fullText = parseBlocks(getResponse.Blocks || []);
  let nextToken = getResponse.NextToken;

  while (nextToken) {
    const getCommand = new GetDocumentTextDetectionCommand({
      JobId: jobId,
      NextToken: nextToken
    });
    const paginatedResponse = await textractClient.send(getCommand);
    fullText += "\n" + parseBlocks(paginatedResponse.Blocks || []);
    nextToken = paginatedResponse.NextToken;
  }

  return fullText.trim();
}

async function extractTextFromDocument(bucketName, key) {
  if (key.toLowerCase().endsWith(".pdf")) {
    return runAsyncTextract(bucketName, key);
  }

  try {
    const command = new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: bucketName,
          Name: key
        }
      }
    });
    const response = await textractClient.send(command);
    return parseBlocks(response.Blocks || []);
  } catch (error) {
    console.warn("Synchronous DetectDocumentText failed, attempting async fallback:", error);
    return runAsyncTextract(bucketName, key);
  }
}

module.exports = {
  extractTextFromDocument
};
