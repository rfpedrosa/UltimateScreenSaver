import * as dynamoDbLib from "./dynamodb";

export async function get(userId, recipeId){
  const params = {
    TableName: process.env.tableNameRecipes,
    Key: {
      userId: userId,
      recipeId: recipeId
    }
  };

  return await dynamoDbLib.call("get", params);
}
