import { Prisma, type Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { convertLogoBufferToString } from "./bankAccounts";
import { addBudgetAmounts } from "./budgets";
import { addAmountToFund } from "./funds";
import { syncInstitutions } from "./plaid/update_transactions";

export function sumTransactions(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    return Decimal.add(acc, transaction.amount);
  }, new Prisma.Decimal(0));
}

export const transactionsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        filterMonthly: z.boolean().nullable().optional(),
        startOfMonth: z.date().nullable().optional(),
        endOfMonth: z.date().nullable().optional(),
        includeSavings: z.boolean().optional(),
        includeCategorized: z.boolean().optional(),
        includeUncategorized: z.boolean().optional(),
        includeIncome: z.boolean().optional(),
        searchText: z.string().optional(),
        fundId: z.string().nullable().optional(),
        budgetId: z.string().nullable().optional(),
        accountId: z.string().nullable().optional(),
        page: z.number().optional(),
        size: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const page = input.page ?? 0;
      const textFilter = {
        name: {
          contains: input.searchText,
        },
      };
      const transactions = await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.filterMonthly && !!input.startOfMonth && !!input.endOfMonth
            ? {
                date: {
                  gte: input.startOfMonth,
                  lte: input.endOfMonth,
                },
              }
            : {}),
          ...(input.searchText ? textFilter : {}),
          ...(input.fundId
            ? {
                source: {
                  fundId: input.fundId,
                },
              }
            : {}),
          ...(input.budgetId
            ? {
                source: {
                  fundId: input.budgetId,
                },
              }
            : {}),
          ...(input.accountId ? { accountId: input.accountId } : {}),
          OR: [
            {
              ...(input.includeSavings ? { source: { type: "savings" } } : {}),
            },
            {
              ...(input.includeUncategorized ? { source: null } : {}),
            },
            {
              ...(input.includeCategorized ? { source: { type: "fund" } } : {}),
            },
            {
              ...(input.includeCategorized
                ? { source: { type: "budget" } }
                : {}),
            },
            {
              ...(input.includeIncome ? { source: { type: "income" } } : {}),
            },
          ],
        },
        orderBy: {
          date: "desc",
        },
        include: {
          source: {
            include: {
              budget: true,
              fund: true,
            },
          },
        },
        skip: input.size ? page * input.size : page * 6,
        take: input.size ?? 6,
      });

      const budget = input.budgetId
        ? await ctx.prisma.budget.findUniqueOrThrow({
            where: {
              userId: ctx.session.user.id,
              id: input.budgetId,
            },
            include: {
              savingsFund: true,
              sourceTransactions: {
                include: {
                  transaction: true,
                },
              },
            },
          })
        : null;

      const fund = input.fundId
        ? await ctx.prisma.fund.findUniqueOrThrow({
            where: {
              userId: ctx.session.user.id,
              id: input.fundId,
            },
            include: {
              sourceTransactions: {
                include: {
                  transaction: true,
                },
              },
            },
          })
        : null;

      const account = input.accountId
        ? await ctx.prisma.bankAccount.findUniqueOrThrow({
            where: {
              userId: ctx.session.user.id,
              id: input.accountId,
            },
            include: {
              institution: {
                include: {
                  syncItem: true,
                },
              },
            },
          })
        : null;

      return {
        transactions,
        budget: budget ? addBudgetAmounts(budget) : null,
        fund: fund ? addAmountToFund(fund) : null,
        account: account ? convertLogoBufferToString(account) : null,
      };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    await syncInstitutions(ctx.session.user.id);
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        source: {
          include: {
            budget: true,
            fund: true,
          },
        },
      },
    });
  }),
  getByMonth: protectedProcedure
    .input(
      z.object({
        startOfMonth: z.date(),
        endOfMonth: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          datetime: {
            gte: input.startOfMonth,
            lte: input.endOfMonth,
          },
        },
        orderBy: {
          date: "desc",
        },
        include: {
          source: {
            include: {
              budget: true,
              fund: true,
            },
          },
        },
      });
    }),
  getUncategorized: protectedProcedure.query(async ({ ctx }) => {
    const uncategorizedTransactions = await ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
        source: null,
      },
    });
    return {
      count: uncategorizedTransactions.length,
      total: sumTransactions(uncategorizedTransactions),
      transactions: uncategorizedTransactions,
    };
  }),
  getIncomeByMonth: protectedProcedure
    .input(
      z.object({
        startOfMonth: z.date(),
        endOfMonth: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      const incomeTransactions = await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: input.startOfMonth,
            lte: input.endOfMonth,
          },
          source: {
            type: "income",
          },
        },
      });
      return sumTransactions(incomeTransactions);
    }),
  categorizeAsFund: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        fundId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transactionSource.create({
        data: {
          type: "fund",
          fund: {
            connect: { id: input.fundId },
          },
          transaction: {
            connect: { id: input.transactionId },
          },
        },
      });
    }),
  categorizeAsBudget: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        budgetId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transactionSource.create({
        data: {
          type: "budget",
          budget: {
            connect: { id: input.budgetId },
          },
          transaction: {
            connect: { id: input.transactionId },
          },
        },
      });
    }),
  categorizeAsIncome: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.update({
        where: {
          // userId: ctx.session.user.id,
          id: input.id ?? "",
        },
        data: {
          isTransfer: false,
          source: {
            create: {
              type: "income",
            },
          },
        },
      });
    }),
  sumAllTransactionsMonthly: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma
      .$queryRaw`SELECT * FROM dink.Transaction, DATE_FORMAT(date, '%m-%Y') AS date_created WHERE userId = ${ctx.session.user.id} GROUP BY MONTH(date_created), YEAR(date_created);`;
    return data;
  }),
  createFundAllocation: protectedProcedure
    .input(
      z.object({
        fundId: z.string(),
        name: z.string(),
        amount: z.number(),
      })
    )
    .mutation(({ input, ctx }) => {
      const today = new Date();
      return ctx.prisma.transaction.create({
        data: {
          name: input.name,
          note: "",
          isTransfer: false,
          amount: input.amount,
          date: today,
          datetime: today,
          isPending: false,
          user: {
            connect: { id: ctx.session.user.id },
          },
          source: {
            create: {
              type: "savings",
              fund: {
                connect: { id: input.fundId },
              },
            },
          },
        },
      });
    }),
});
