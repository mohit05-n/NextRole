import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "../utils/logger";

const s3Client = new S3Client({});

export async function uploadToS3(
  bucketName: string,
  key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  logger.info(`Uploading file to S3: Bucket=${bucketName}, Key=${key}`);
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    await s3Client.send(command);
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${key}`;
    logger.info(`Upload successful: S3 URL=${s3Url}`);
    return s3Url;
  } catch (error) {
    logger.error(`S3 upload failed: Bucket=${bucketName}, Key=${key}`, error);
    throw error;
  }
}
