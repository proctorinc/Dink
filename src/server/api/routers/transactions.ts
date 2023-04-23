import { Prisma, type Transaction } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumTransactions(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    return Decimal.add(acc, transaction.amount);
  }, new Prisma.Decimal(0));
}

export const transactionsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(
      z.object({
        filterMonthly: z.boolean(),
        startOfMonth: z.date(),
        endOfMonth: z.date(),
        includeSavings: z.boolean(),
        includeCategorized: z.boolean(),
        includeUncategorized: z.boolean(),
        includeIncome: z.boolean(),
        searchText: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const monthFilter = {
        date: {
          gte: input.startOfMonth,
          lte: input.endOfMonth,
        },
      };
      const textFilter = {
        name: {
          contains: input.searchText,
        },
      };
      return await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.filterMonthly ? monthFilter : {}),
          ...(input.searchText ? textFilter : {}),
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
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        source: true,
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
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
        source: null,
      },
      include: {
        category: true,
        personalFinanceCategory: true,
        paymentMetadata: true,
        location: true,
        account: true,
      },
    });
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
