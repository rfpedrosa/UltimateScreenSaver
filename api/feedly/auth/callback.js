import { failure } from "../../shared/response";
import AWS from "aws-sdk";
import { credentials } from '../../external/feedly/credentials'
import * as OAuth2 from "simple-oauth2";
import * as tokensDb from '../../shared/tokensDb';

const provider = 'feedly';

export async function main(event, context, callback) {
  const state = JSON.parse(decodeURIComponent(event.queryStringParameters.state));

  const params = {
    code: event.queryStringParameters.code,
    error: event.queryStringParameters.error,
  };

  const response = {
    statusCode: 302,
    headers: {
      Location: state.callingUrl,
    }
  };

  if (params.error) {
    return response;
  }

  const client = OAuth2.create(credentials);

  const options = {
    code: params.code,
    client_id: process.env.feedlyClientId,
    client_secret: process.env.feedlyClientSecret,
    redirect_uri: `${process.env.baseUrl}/${provider}/auth/callback`,
    grant_type: 'authorization_code',
  };

  let token;
  try {
    const access = await client.authorizationCode.getToken(options);
    const result = await client.accessToken.create(access);

    token = result.token;
  } catch (e) {
    console.log('Access Token Error', e.message);
    return failure({ status: false, error: e });
  }

  AWS.config.update({ region: process.env.AWS_REGION });
  const awsCredentials = new AWS.Credentials(process.env.AWSAccessKey, process.env.AWSSecretKey, null)
  AWS.config.credentials = awsCredentials;

  try {
    const getResult = await tokensDb.get(state.userId, provider);
    if (getResult.Item) {
      await tokensDb.update(state.userId, provider, token);
    }
    else {
      await tokensDb.put(state.userId, provider, token);
    }

  } catch (e) {
    console.log('error', e);
    return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
  }

  return response;
}
