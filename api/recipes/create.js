import uuid from "uuid";
import * as dynamoDbLib from "../shared/dynamodb";
import { success, failure } from "../shared/response";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableNameRecipes,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      recipeId: uuid.v1(),
      title: data.title,
      albums: data.googleAlbums,
      folders: data.dropboxFolders,
      feedsEnabled: data.feedlyEnabled,
      feeds: data.feedlyFeeds,
      transitionEffect: {
        type: data.transition,
        duration: data.transitionSeconds,
      },
      displayEffect: {
        type: data.display,
      },

      createdAt: Date.now(),
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.error(e);
    return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
  }
}
