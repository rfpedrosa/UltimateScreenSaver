import * as dynamoDbLib from "../shared/dynamodb";
import { success, failure } from "../shared/response";
import * as playlistProvider from "../providers/playlistProvider";

export async function main(event, context) {
    const params = {
        TableName: process.env.tableNameRecipes,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            recipeId: event.queryStringParameters.recipeId
        }
    };

  try {
    const result = await dynamoDbLib.call("get", params);
    const recipe = result.Item;
    if (!recipe) {
      return failure({ status: false, errorMessage: "Receipe not found." });
    }

    return success(await playlistProvider.getPlaylist(recipe, event.requestContext.identity.cognitoIdentityId));

  } catch (e) {
    console.error(e);
    return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
  }
}
