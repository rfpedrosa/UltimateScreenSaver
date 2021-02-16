import * as dynamoDbLib from "../shared/dynamodb";
import { success, failure } from "../shared/response";

export async function main(event, context) {
    const params = {
        TableName: process.env.tableNameRecipes,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            recipeId: event.pathParameters.id
        }
    };

    try {
        const result = await dynamoDbLib.call("delete", params);
        return success({ status: true });
    } catch (e) {
        console.error(e);
        return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
    }
}
