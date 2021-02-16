import { success, failure } from "../shared/response";
import * as googlePhotosApi from "../external/google/photosApi";

export async function main(event, context) {
  let albums = [];
  try {
    albums = await googlePhotosApi.getAlbums(event.requestContext.identity.cognitoIdentityId);
  } catch (err) {
    console.log(err);
    return failure({ status: false, errorCode: err.statusCode, errorMessage: err.message });
  }

  return success(albums);
}

