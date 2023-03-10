import { fetchQuery } from "@/lib/fetch";

export const getFunds = async () => {
  return fetchQuery({
    endpoint: "/bank/funds",
  });
};
