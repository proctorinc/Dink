import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  CountryCode,
  Products,
  type RemovedTransaction,
  type Transaction,
} from "plaid";
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

      const plaidItemId = response.data.item_id;
      const accessToken = response.data.access_token;

      const institution = await plaidClient
        .institutionsGetById({
          institution_id: input.institutionId,
          country_codes: [CountryCode.Us],
          options: {
            include_optional_metadata: true,
          },
        })
        .then((response) => response.data.institution);

      await ctx.prisma.plaidItem.create({
        data: {
          id: response.data.item_id,
          accessToken,
          status: "good",
          user: {
            connect: { id: ctx.session.user.id },
          },
          institution: {
            create: {
              name: institution.name,
              logo: Buffer.from(String(institution.logo), "utf-8"),
              url: institution.url,
              primary_color: institution.primary_color,
            },
          },
        },
      });

      // Fetch transaction updates with plaid item id
      let added: Transaction[] = [];
      let modified: Transaction[] = [];
      let removed: RemovedTransaction[] = [];
      let cursor = "";
      let hasMore = true;

      const batchSize = 100;
      try {
        // Iterate through each page of new transaction updates for item
        /* eslint-disable no-await-in-loop */
        while (hasMore) {
          const response = await plaidClient.transactionsSync({
            access_token: accessToken,
            cursor: cursor ?? null,
            count: batchSize,
          });
          const data = response.data;
          // Add this page of results
          added = added.concat(data.added);
          modified = modified.concat(data.modified);
          removed = removed.concat(data.removed);
          hasMore = data.has_more;
          cursor = data.next_cursor;
        }
      } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError) {
          console.error("Error:", err.message, err.cause);
        }
        console.error("Unknown Error:", err);
        // console.error(`Error fetching transactions: ${err.message}`);
        // Change cursor to original before fetching new transactions
        // cursor = lastCursor;
      }

      // Fetch accounts with access token
      const accounts = await plaidClient
        .accountsGet({ access_token: response.data.access_token })
        .then((accountsResponse) => accountsResponse.data.accounts);

      // Create accounts
      accounts.map(async (account) => {
        await ctx.prisma.bankAccount.create({
          data: {
            id: account.account_id,
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
      added.concat(modified).map(async (transaction) => {
        await ctx.prisma.transaction.upsert({
          where: {
            id: transaction.transaction_id,
          },
          update: {
            amount: transaction.amount,
            account_owner: transaction.account_owner,
            authorized_datetime: transaction.authorized_datetime,
            checkNumber: transaction.check_number,
            date: new Date(transaction.date),
            datetime: transaction.datetime,
            isoCurrencyCode: transaction.iso_currency_code,
            address: transaction.location.address,
            city: transaction.location.city,
            country: transaction.location.country,
            lat: transaction.location.lat,
            lon: transaction.location.lon,
            postal_code: transaction.location.postal_code,
            region: transaction.location.region,
            store_number: transaction.location.store_number,
            merchantName: transaction.merchant_name,
            name: transaction.name,
            paymentChannel: transaction.payment_channel,
            by_order_of: transaction.payment_meta.by_order_of,
            payee: transaction.payment_meta.payee,
            payer: transaction.payment_meta.payer,
            payment_method: transaction.payment_meta.payment_method,
            payment_processor: transaction.payment_meta.payment_processor,
            ppd_id: transaction.payment_meta.ppd_id,
            reason: transaction.payment_meta.reason,
            reference_number: transaction.payment_meta.reference_number,
            pending: transaction.pending,
            pendingTransactionId: transaction.pending_transaction_id,
            personalFinanceCategory: String(
              transaction.personal_finance_category
            ),
            personalFinanceCategoryIcon:
              transaction.personal_finance_category_icon_url,
            transactionCode: transaction.transaction_code,
            unofficialCurrencyCode: transaction.unofficial_currency_code,
          },
          create: {
            amount: transaction.amount,
            account_owner: transaction.account_owner,
            authorized_datetime: transaction.authorized_datetime,
            checkNumber: transaction.check_number,
            date: new Date(transaction.date),
            datetime: transaction.datetime,
            isoCurrencyCode: transaction.iso_currency_code,
            address: transaction.location.address,
            city: transaction.location.city,
            country: transaction.location.country,
            lat: transaction.location.lat,
            lon: transaction.location.lon,
            postal_code: transaction.location.postal_code,
            region: transaction.location.region,
            store_number: transaction.location.store_number,
            merchantName: transaction.merchant_name,
            name: transaction.name,
            paymentChannel: transaction.payment_channel,
            by_order_of: transaction.payment_meta.by_order_of,
            payee: transaction.payment_meta.payee,
            payer: transaction.payment_meta.payer,
            payment_method: transaction.payment_meta.payment_method,
            payment_processor: transaction.payment_meta.payment_processor,
            ppd_id: transaction.payment_meta.ppd_id,
            reason: transaction.payment_meta.reason,
            reference_number: transaction.payment_meta.reference_number,
            pending: transaction.pending,
            pendingTransactionId: transaction.pending_transaction_id,
            personalFinanceCategory: String(
              transaction.personal_finance_category
            ),
            personalFinanceCategoryIcon:
              transaction.personal_finance_category_icon_url,
            transactionCode: transaction.transaction_code,
            unofficialCurrencyCode: transaction.unofficial_currency_code,
            // category: {
            //   createMany: {  }
            // },
            isTransfer: false,
            account: {
              connect: { id: transaction.account_id },
            },
            user: {
              connect: { id: ctx.session.user.id },
            },
          },
        });
      });

      // Delete transactions
      removed.map(async (transaction) => {
        await ctx.prisma.transaction.delete({
          where: {
            id: transaction.transaction_id,
          },
        });
      });

      // Update transaction cursor
      await ctx.prisma.plaidItem.update({
        where: {
          id: plaidItemId,
        },
        data: {
          cursor: cursor,
        },
      });

      return {
        addedCount: added.length,
        modifiedCount: modified.length,
        removedCount: removed.length,
      };
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
