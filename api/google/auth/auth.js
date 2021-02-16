import { credentials } from '../../external/google/credentials'

export async function main(event, context, callback) {
  const state = {
    callingUrl: event.headers['Referer'],
    userId: event.queryStringParameters.state,
  };

  const oauth2 = require('simple-oauth2').create(credentials);
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.baseUrl}/google/auth/callback`,
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly profile',
    prompt: 'select_account consent',
    state: encodeURIComponent(JSON.stringify(state)),
  });

  const response = {
    statusCode: 302,
    headers: {
      Location: authorizationUri,
    }
  };

  return callback(null, response);
}
