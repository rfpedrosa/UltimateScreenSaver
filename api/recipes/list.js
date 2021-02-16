import * as dynamoDbLib from "../shared/dynamodb";
import { success, failure } from "../shared/response";

export async function main(event, context) {
    const params = {
        TableName: process.env.tableNameRecipes,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };
    try {
        const result = await dynamoDbLib.call("query", params);
        // Return the matching list of items in response body
        return success(result.Items);
    } catch (e) {
        return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
    }
}
