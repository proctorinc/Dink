import { Configuration, PlaidEnvironments, PlaidApi } from "plaid";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  basePath:
    env.PLAID_ENV == "development"
      ? PlaidEnvironments.development
      : PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET":
        env.PLAID_ENV == "development"
          ? env.PLAID_DEV_SECRET
          : env.PLAID_SANDBOX_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export default plaidClient;
