# Ultimate Screen Saver API

This API is based on "Serverless Node.js Starter". The Serverless starter adds ES7 syntax, serverless-offline, environment variables, and unit test support. Part of the [Serverless Stack](http://serverless-stack.com) guide.

[Serverless Node.js Starter](https://github.com/AnomalyInnovations/serverless-nodejs-starter) uses the [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin, [Babel](https://babeljs.io), [serverless-offline](https://github.com/dherault/serverless-offline), and [Jest](https://facebook.github.io/jest/). It supports:

- **ES7 syntax in your handler functions**
  - Use `import` and `export`
- **Package your functions using Webpack**
- **Run API Gateway locally**
  - Use `serverless offline start`
- **Support for unit tests**
  - Run `npm test` to run your tests
- **Sourcemaps for proper error messages**
  - Error message show the correct line numbers
  - Works in production with CloudWatch
- **Automatic support for multiple handler files**
  - No need to add a new entry to your `webpack.config.js`
- **Add environment variables for your stages**

### Requirements

- [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
- [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
- [API git repository access](https://dev.azure.com/ruifilipepedrosa/UltimateScreenSaver/_git/api)

### Installation

Clone [API git repository access](https://dev.azure.com/ruifilipepedrosa/UltimateScreenSaver/_git/api)

Enter the new directory

``` bash
$ cd api
```

Install the Node.js packages

``` bash
$ npm install
```

### Usage

To run unit tests on your local

``` bash
$ npm test
```

To run a function on your local

``` bash
$ serverless invoke local --function create --path mocks/create-event.json
```

To simulate API Gateway locally using [serverless-offline](https://github.com/dherault/serverless-offline)

``` bash
$ serverless offline start
```

Deploy your project

``` bash
$ serverless deploy
```

Deploy a single function

``` bash
$ serverless deploy function --function hello
```

[Test the APIs](https://serverless-stack.com/chapters/test-the-apis.html)

``` bash
$ npx aws-api-gateway-cli-test \
--username='admin@example.com' \
--password='Passw0rd!' \
--user-pool-id='YOUR_COGNITO_USER_POOL_ID' \
--app-client-id='YOUR_COGNITO_APP_CLIENT_ID' \
--cognito-region='YOUR_COGNITO_REGION' \
--identity-pool-id='YOUR_IDENTITY_POOL_ID' \
--invoke-url='YOUR_API_GATEWAY_URL' \
--api-gateway-region='YOUR_API_GATEWAY_REGION' \
--path-template='/notes' \
--method='POST' \
--body='{"content":"hello world","attachment":"hello.jpg"}'
```

To add another function as a new file to your project, simply add the new file and add the reference to `serverless.yml`. The `webpack.config.js` automatically handles functions in different files.

### Setup your local environment

1. Rename `env.example` to `env.yml`.
2. Add environment variables for the various stages to `env.yml`.
3. Make sure to not commit your `env.yml`.
4. If you want to use serverless-offline, update SLS_COGNITO_IDENTITY_ID environment variable in package.json file at line 8 or 9. SLS_COGNITO_IDENTITY_ID environment variable sets variable event.requestContext.identity.cognitoIdentityId. You can get cognito identity id value from identity browser in cognito identity pools. Example value: eu-west-1:66962659-97c4-4009-972c-dbffe05fa4d4
5. You can now [run your serverless stack locally in an offline mode `npm run-script debug_mac` or `npm run-script debug_windows`](https://dev.azure.com/ruifilipepedrosa/UltimateScreenSaver/_git/api?path=%2F.vscode%2Flaunch.json&version=GBmaster&line=6&lineStyle=plain&lineEnd=31&lineStartColumn=1&lineEndColumn=1) or deploy the api by `serverless deploy -v` and point your frontend to it. 

If `serverless deploy -v` succeeds, it will be displayed in the console what you need to know to point your [Ultimate screen saver client](https://dev.azure.com/ruifilipepedrosa/UltimateScreenSaver/_git/webapp?path=%2Fsrc%2Fconfig.js&version=GBmaster&line=1&lineStyle=plain&lineEnd=13&lineStartColumn=1&lineEndColumn=1);

### Support

- Send us an [email](mailto:contact@anoma.ly) if you have any questions
- Open a [new issue](https://github.com/AnomalyInnovations/serverless-nodejs-starter/issues/new) if you've found a bug or have some suggestions.
- Or submit a pull request!

### Maintainers

Serverless Node.js Starter is maintained by Frank Wang ([@fanjiewang](https://twitter.com/fanjiewang)) & Jay V ([@jayair](https://twitter.com/jayair)). [**Subscribe to our newsletter**](http://eepurl.com/cEaBlf) for updates. Send us an [email](mailto:contact@anoma.ly) if you have any questions.
