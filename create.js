import uuid from 'uuid';
import * as dynamoDb from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

// AWS.config.update({ region: 'us-east-2' });
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDb.call('put', params);
    return success(params.Item);
  } catch (error) {
    return failure({ status: false, error });
  }
};
