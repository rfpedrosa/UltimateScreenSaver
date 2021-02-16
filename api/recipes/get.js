import { success, failure } from "../shared/response";
import * as recipeDb from "../shared/recipeDb";

export async function main(event, context) {

  const args = {
    userId: event.requestContext.identity.cognitoIdentityId,
    recipeId: event.pathParameters.id
  };
  
  try {
    console.info(`Retrieve recipe: ${event.pathParameters.id}`);
    const result = await recipeDb.get(args.userId, args.recipeId);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return notFound({ status: false, errorMessage: "Recipe not found." });
    }
  } catch (e) {
    console.error(e);
    return failure({ status: false, errorCode: e.errorCode, errorMessage: e.errorMessage });
  }

}
