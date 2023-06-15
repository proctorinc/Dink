import { TRPCError } from "@trpc/server";
import { CountryCode, Products } from "plaid";
import { z } from "zod";
import plaidClient from "~/server/api/plaid";
import {
  createTRPCRouter,
  protectedProcedure,
  userProcedure,
} from "~/server/api/trpc";
import {
  createInstitutionSync,
  retrievePlaidItemByInstitutionId,
} from "./queries/items";
import { exchangePublicToken } from "./queries/tokens";
import { syncTransactions } from "./update_transactions";
import institutionsJson from "../../../data/institutions.json";
import savingsFundsJson from "../../../data/savings.json";
import budgetsJson from "../../../data/budgets.json";
import { getFirstDayOfMonth } from "~/utils";

const demoInstitutionsSchema = z
  .object({
    name: z.string(),
    logo: z.string(),
    url: z.string(),
    primaryColor: z.string(),
    accounts: z
      .object({
        available: z.number().nullable(),
        current: z.number(),
        isoCurrencyCode: z.string(),
        unofficialCurrencyCode: z.string(),
        creditLimit: z.number().nullable(),
        mask: z.string(),
        name: z.string(),
        officialName: z.string().nullable(),
        subtype: z.string(),
        type: z.string(),
        creditClosingDay: z.number().nullable(),
        ignore: z.boolean(),
      })
      .array(),
  })
  .array();

const demoFundsSchema = z
  .object({
    icon: z.string(),
    name: z.string(),
  })
  .array();

const demoBudgetsSchema = z
  .object({
    goal: z.number(),
    icon: z.string(),
    name: z.string(),
  })
  .array();

export const plaidRouter = createTRPCRouter({
  getLinkToken: userProcedure.mutation(async ({ ctx }) => {
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
  createInstitution: userProcedure
    .input(
      z.object({
        publicToken: z.string(),
        institutionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { publicToken, institutionId } = input;
      const userId = ctx.session.user.id;
      const existingInstitution = await retrievePlaidItemByInstitutionId(
        institutionId
      );

      if (existingInstitution) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have linked this institution",
        });
      }

      const { itemId, accessToken } = await exchangePublicToken(publicToken);
      await createInstitutionSync({
        userId,
        itemId,
        institutionId,
        accessToken,
      });

      await syncTransactions(userId, itemId);
    }),
  loadDemoData: protectedProcedure.query(({ ctx }) => {
    // Confirm that demo data has not been updated already
    // Then upsert the demo data

    if (ctx.session.user.role === "demo") {
      const userId = ctx.session.user.id;
      const institutions = demoInstitutionsSchema.parse(institutionsJson);

      // Create Institutions and bank accounts
      institutions.map(async (institutionData) => {
        const itemId = `${userId}-demo-${institutionData.name}`;
        const institution = await ctx.prisma.institution.create({
          data: {
            name: institutionData.name,
            logo: Buffer.from(String(institutionData.logo), "utf-8"),
            url: institutionData.url,
            primaryColor: institutionData.primaryColor,
            syncItem: {
              create: {
                plaidId: itemId,
                accessToken: `${itemId}-access-token`,
                status: "demo",
              },
            },
            user: {
              connect: { id: userId },
            },
          },
        });
        institutionData.accounts.map(async (bankAccount) => {
          await ctx.prisma.bankAccount.create({
            data: {
              plaidId: `${userId}-demo-${bankAccount.name}`,
              ...bankAccount,
              user: {
                connect: { id: userId },
              },
              institution: {
                connect: { id: institution.id },
              },
            },
          });
        });
      });

      const savingsFunds = demoFundsSchema.parse(savingsFundsJson);

      // Create transactions
      // Create savings funds
      savingsFunds.map(async (fund) => {
        await ctx.prisma.fund.create({
          data: {
            icon: fund.icon,
            name: fund.name,
            user: {
              connect: { id: userId },
            },
          },
        });
      });

      const budgets = demoBudgetsSchema.parse(budgetsJson);

      // Create budgets
      budgets.map(async (budget) => {
        await ctx.prisma.budget.create({
          data: {
            icon: budget.icon,
            name: budget.name,
            goal: budget.goal,
            startDate: getFirstDayOfMonth(new Date()),
            user: {
              connect: { id: userId },
            },
          },
        });
      });
    }

    return true;
  }),
});
