 //Create configuration settings
  export const credentials = {
    client: {
      id: process.env.feedlyClientId,
      secret: process.env.feedlyClientSecret,
    },
    auth: {
      authorizeHost: process.env.feedlyAuthorizationHost,
      authorizePath: '/v3/auth/auth',
      tokenHost: process.env.feedlyTokenHost,
      tokenPath: '/v3/auth/token',
    }
  };
