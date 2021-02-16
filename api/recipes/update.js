import * as dynamoDbLib from "../shared/dynamodb";
import { success, failure } from "../shared/response";

export async function main(event, context) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableNameRecipes,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            recipeId: event.pathParameters.id
        },
        UpdateExpression: "SET title = :title",
        ExpressionAttributeValues: {
            ":title": data.title || null
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDbLib.call("update", params);
        return success({ status: true });
    } catch (e) {
        console.error(e);
        return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
    }
}
