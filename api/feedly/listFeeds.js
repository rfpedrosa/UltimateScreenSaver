import { success, failure } from "../shared/response";
import axios from "axios";
import * as api from "../external/feedly/api";
import * as tokensDb from "../shared/tokensDb";

export async function main(event, context) {
  const resultProvider = await tokensDb.get(event.requestContext.identity.cognitoIdentityId, 'feedly');
  let accessToken = resultProvider.Item.providerData.access_token;
  try {
    accessToken = await api.refreshTokenIfExpired(resultProvider.Item);
  } catch (e) {
    console.error('Error refreshing access token: ', e.message);
    throw e;
  }

  try {
    const result = await axios.get(`${process.env.feedlyApiBaseUrl}/v3/collections`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      json: true,
    });

    return success(result.data);
  } catch (err) {

    console.log(err);
    return failure({ status: false, errorCode: err.statusCode, errorMessage: err.message });
  }
}

