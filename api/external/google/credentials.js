 //Create configuration settings
  export const credentials = {
    client: {
      id: process.env.googleClientId,
      secret: process.env.googleClientSecret,
    },
    auth: {
      authorizeHost: process.env.googleAuthorizationHost,
      authorizePath: '/o/oauth2/v2/auth',
      tokenHost: process.env.googleTokenHost,
      tokenPath: '/oauth2/v4/token',
    }
  };
