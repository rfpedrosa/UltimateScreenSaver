
import { API } from "aws-amplify";

const Providers = {
  obtainProvider: async (provider, userId) => {
    const endpoint = await API.endpoint('api');

    const url = `${endpoint}/${provider}/auth/auth?state=${userId}`;
    window.location = url;
  },

  fetchProviders: async () => {
    const providers = await API.get("api", `/user/providers/connections`);

    return providers;
  },
}

export default Providers;
