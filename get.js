import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export const main = async (event, context) => {
  const params = {
    TableName: process.env.tableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };
  try {
    const { Item } = await dynamoDbLib.call('get', params);
    return Item ? success(Item) : failure({ status: false, error: 'Item not found.' });
  } catch (e) {
    return failure({ status: false });
  }
};
