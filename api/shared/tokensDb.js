import * as dynamoDbLib from "./dynamodb";

export async function get(userId, provider){
  const params = {
    TableName: process.env.tableNameUserTokens,
    Key: {
      userId: userId,
      provider: provider,
    }
  };

  return await dynamoDbLib.call("get", params);
}

export async function query(userId){
  const params = {
    TableName: process.env.tableNameUserTokens,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    }
  };

  return await dynamoDbLib.call("query", params);
}

export async function update(userId, provider, token){
  const expiresAtMiliseconds = token.expires_at ? token.expires_at.getTime() : undefined;

  const params = {
    TableName: process.env.tableNameUserTokens,
    Key: {
      userId: userId,
      provider: provider,
    },
    UpdateExpression: "SET providerData = :providerData",
    ExpressionAttributeValues: {
      ":providerData": {
        access_token: token.access_token || null,
        refresh_token: token.refresh_token || null,
        expires_in: token.expires_in || 0,
        expires_at: expiresAtMiliseconds,
      } || null,
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoDbLib.call("update", params);
}

export async function put(userId, provider, token){
  const expiresAtMiliseconds = token.expires_at ? token.expires_at.getTime() : undefined;

  const params = {
    TableName: process.env.tableNameUserTokens,
    Item: {
      userId: userId,
      provider: provider,
      providerData: {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_in: token.expires_in || 0,
        expires_at: expiresAtMiliseconds,
      },
      createdAt: Date.now(),
    }

  };

  await dynamoDbLib.call("put", params);
}
