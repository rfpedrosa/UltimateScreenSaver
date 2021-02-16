 //Create configuration settings
  export const credentials = {
    client: {
      id: process.env.dropboxClientId,
      secret: process.env.dropboxClientSecret,
    },
    auth: {
      authorizeHost: process.env.dropboxAuthorizationHost,
      authorizePath: '/oauth2/authorize',
      tokenHost: process.env.dropboxTokenHost,
      tokenPath: '/oauth2/token',
    }
  };
