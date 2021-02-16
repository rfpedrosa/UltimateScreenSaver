import * as dynamoDbLib from "../../../shared/dynamodb";
import { success, failure } from "../../../shared/response";

export async function main(event, context) {
  const params = {
    TableName: process.env.tableNameUserTokens,
    KeyConditionExpression: `userId = :userId`,
    ExpressionAttributeValues: {
      ":userId": event.requestContext.identity.cognitoIdentityId,
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);

    return success(result.Items.map((value) => {
      return value.provider;
    }));
  } catch (e) {
    console.log(e);
    return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
  }

}
