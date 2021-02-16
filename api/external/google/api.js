import * as tokensDb from "../../shared/tokensDb";
import { credentials } from "./credentials";
import * as OAuth2 from "simple-oauth2";

export async function refreshTokenIfExpired(providerItem) {
  const tokenObject = {
    'access_token': providerItem.providerData.access_token,
    'refresh_token': providerItem.providerData.refresh_token,
    'expires_in': providerItem.providerData.expires_in,
    'expires_at': new Date(providerItem.providerData.expires_at),
  };

  const client = OAuth2.create(credentials);
  // Create the access token wrapper
  let accessToken = client.accessToken.create(tokenObject);

  // Check if the token is expired. If expired it is refreshed.
  const EXPIRATION_WINDOW_IN_SECONDS = 300;

  const { token } = accessToken;
  const expirationTimeInSeconds = token.expires_at.getTime() / 1000;
  const expirationWindowStart = expirationTimeInSeconds - EXPIRATION_WINDOW_IN_SECONDS;

  // If the start of the window has passed, refresh the token
  const nowInSeconds = (new Date()).getTime() / 1000;
  const shouldRefresh = nowInSeconds >= expirationWindowStart;
  if (shouldRefresh) {
    console.log('refreshing token');
    accessToken = await accessToken.refresh();
    tokensDb.update(providerItem.userId, providerItem.provider, { ...accessToken.token, refresh_token: tokenObject.refresh_token });
  }

  return accessToken.token.access_token;
}
