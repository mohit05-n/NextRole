const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE || "NextRoleUsers";

async function getProfileByEmail(email) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { email }
    });
    const response = await docClient.send(command);
    return response.Item || null;
  } catch (error) {
    console.error("DynamoDB GetItem error:", error);
    throw new Error(`Failed to retrieve profile from DynamoDB: ${error.message}`);
  }
}

async function putProfile(profile) {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        ...profile,
        updatedAt: new Date().toISOString()
      }
    });
    await docClient.send(command);
  } catch (error) {
    console.error("DynamoDB PutItem error:", error);
    throw new Error(`Failed to save profile inside DynamoDB: ${error.message}`);
  }
}

module.exports = {
  getProfileByEmail,
  putProfile
};
