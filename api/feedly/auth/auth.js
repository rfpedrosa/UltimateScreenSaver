import { credentials } from '../../external/feedly/credentials'

export async function main(event, context, callback) {
  const state = {
    callingUrl: event.headers['Referer'],
    userId: event.queryStringParameters.state,
  };

  const oauth2 = require('simple-oauth2').create(credentials);
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    response_type: 'code',
    redirect_uri: `${process.env.baseUrl}/feedly/auth/callback`,
    scope: 'https://cloud.feedly.com/subscriptions',
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
