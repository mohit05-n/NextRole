import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { logger } from "../utils/logger";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || "NextRoleUsers";

export async function getUserProfile(email: string): Promise<any | null> {
  logger.info(`Fetching user profile from DynamoDB for email: ${email}`);
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { email }
    });
    const response = await docClient.send(command);
    if (!response.Item) {
      logger.info(`No profile found in DynamoDB for email: ${email}`);
      return null;
    }
    logger.info(`Profile retrieved successfully for email: ${email}`);
    return response.Item;
  } catch (error) {
    logger.error(`DynamoDB GetItem failed for email: ${email}`, error);
    throw error;
  }
}

export async function saveUserProfile(profile: any): Promise<void> {
  if (!profile.email) {
    throw new Error("Cannot save user profile: email is required");
  }
  logger.info(`Saving user profile to DynamoDB for email: ${profile.email}`);
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...profile,
        updatedAt: new Date().toISOString()
      }
    });
    await docClient.send(command);
    logger.info(`Profile saved successfully for email: ${profile.email}`);
  } catch (error) {
    logger.error(`DynamoDB PutItem failed for email: ${profile.email}`, error);
    throw error;
  }
}
