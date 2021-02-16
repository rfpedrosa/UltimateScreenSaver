import { failure, success } from "../../shared/response";
import AWS from "aws-sdk";
import { credentials } from '../../external/dropbox/credentials'
import * as tokensDb from '../../shared/tokensDb';
import axios from "axios";
import qs from 'qs';

const provider = 'dropbox';

export async function main(event, context, callback) {
  const state = JSON.parse(decodeURIComponent(event.queryStringParameters.state));
  const response = {
    statusCode: 302,
    headers: {
      Location: state.callingUrl,
    }
  };
  if (event.queryStringParameters.error) {
    return response;
  }

  let token;
  try {
    const result = await axios({
      method: 'post',
      url: `${credentials.auth.tokenHost}${credentials.auth.tokenPath}`,
      data: qs.stringify({
        code: event.queryStringParameters.code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.baseUrl}/${provider}/auth/callback`,
        client_id: process.env.dropboxClientId,
        client_secret: process.env.dropboxClientSecret,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });

    token = {
      access_token: result.data.access_token,
      expires_in: 0,
    };

  }
  catch (e) {
    console.log('Access Token Error', e);
    return failure({ status: false, error: e });
  }

  AWS.config.update({ region: process.env.AWS_REGION });
  const awsCredentials = new AWS.Credentials(process.env.AWSAccessKey, process.env.AWSSecretKey, null)
  AWS.config.credentials = awsCredentials;

  try {
    const getResult = await tokensDb.get(state.userId, provider);
    if (getResult && getResult.Item) {
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
