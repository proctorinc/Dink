import { CountryCode, Products } from "plaid";
import { z } from "zod";
import plaidClient from "~/server/api/plaid";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const plaidRouter = createTRPCRouter({
  getLinkToken: protectedProcedure.mutation(async ({ ctx }) => {
    return await plaidClient
      .linkTokenCreate({
        user: {
          client_user_id: ctx.session.user.id,
        },
        client_name: "Dink",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "en",
      })
      .then((response) => response.data.link_token);
  }),
  createItem: protectedProcedure
    .input(
      z.object({
        publicToken: z.string(),
        institutionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await plaidClient.itemPublicTokenExchange({
        public_token: input.publicToken,
      });

      await ctx.prisma.plaidItem.create({
        data: {
          id: response.data.item_id,
          plaidId: response.data.item_id,
          institutionId: input.institutionId,
          accessToken: response.data.access_token,
          status: "good",
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });

      // Fetch transaction updates with plaid item id

      // Fetch accounts with access token
      const accounts = await plaidClient
        .accountsGet({ access_token: response.data.access_token })
        .then((accountsResponse) => accountsResponse.data.accounts);

      // Create accounts
      accounts.map(async (account) => {
        await ctx.prisma.bankAccount.create({
          data: {
            plaidAccountId: account.account_id,
            available: account.balances.available,
            current: account.balances.current,
            iso_currency_code: account.balances.iso_currency_code,
            limit: account.balances.limit,
            unofficial_currency_code: account.balances.unofficial_currency_code,
            mask: account.mask,
            name: account.name,
            official_name: account.official_name,
            subtype: account.subtype,
            type: account.type === "other" ? "cash" : account.type,
            user: {
              connect: { id: ctx.session.user.id },
            },
            item: {
              connect: { id: response.data.item_id },
            },
          },
        });
      });

      // Create or update transactions

      // Delete transactions?

      // Update transaction cursor?

      return;
    }),
  getInstitution: protectedProcedure
    .input(z.object({ institutionId: z.string() }))
    .query(async ({ input }) => {
      return await plaidClient
        .institutionsGetById({
          institution_id: input.institutionId,
          country_codes: [CountryCode.Us],
          options: {
            include_optional_metadata: true,
          },
        })
        .then((response) => response.data.institution);
    }),
});
