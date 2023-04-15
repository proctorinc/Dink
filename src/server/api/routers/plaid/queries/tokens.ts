import plaidClient from "~/server/api/plaid";

export async function exchangePublicToken(publicToken: string) {
  const { data } = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });
  return {
    accessToken: data.access_token,
    itemId: data.item_id,
  };
}
