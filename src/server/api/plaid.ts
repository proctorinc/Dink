import { Configuration, PlaidEnvironments, PlaidApi } from "plaid";
import { env } from "~/env.mjs";

let plaidEnvironment = PlaidEnvironments.sandbox;
let plaidSecret = env.PLAID_SANDBOX_SECRET;

if (env.PLAID_ENV === "production") {
  plaidEnvironment = PlaidEnvironments.production;
  plaidSecret = env.PLAID_PROD_SECRET;
} else if (env.PLAID_ENV === "development") {
  plaidEnvironment = PlaidEnvironments.development;
  plaidSecret = env.PLAID_DEV_SECRET;
}

const configuration = new Configuration({
  basePath: plaidEnvironment,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": plaidSecret,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default plaidClient;
