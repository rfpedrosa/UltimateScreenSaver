import { success, failure } from "../shared/response";
import * as dropboxApiV2 from "../external/dropbox/apiV2";

export async function main(event, context) {
  try {
    let folders = await dropboxApiV2.listFolders(event.requestContext.identity.cognitoIdentityId, {
      path: '',
      recursive: true
    }, 'folder');

    return success(folders);
  } catch (err) {
    console.error(err);
    return failure({ status: false, errorCode: err.statusCode, errorMessage: err.message });
  }
}

