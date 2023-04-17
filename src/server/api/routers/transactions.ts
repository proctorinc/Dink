import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
      })
    )
    .query(async ({ input, ctx }) => {
      const monthFilter = {
        datetime: {
          gte: input.startOfMonth,
          lte: input.endOfMonth,
        },
      };
      // TODO: create custom query
      return await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.filterMonthly ? monthFilter : {}),
          // source: {
          //   OR: [
          //     {
          //       ...(input.includeSavings ? { type: "savings" } : {}),
          //     },
          //     {
          //       ...(input.includeUncategorized ? { type: null } : {}),
          //     },
          //     {
          //       ...(input.includeCategorized ? { type: "fund" } : {}),
          //     },
          //     {
          //       ...(input.includeCategorized ? { type: "budget" } : {}),
          //     },
          //     {
          //       ...(input.includeIncome ? { type: "income" } : {}),
          //     },
          //   ],
          // },
        },
        orderBy: {
          datetime: "desc",
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
    });
  }),
  getIncomeByMonth: protectedProcedure
    .input(
      z.object({
        startOfMonth: z.date(),
        endOfMonth: z.date(),
      })
    )
    .query(({ input, ctx }) => {
      // TODO: create custom query
      // const income = await ctx.prisma
      //   .$queryRaw`SELECT * FROM Transaction as t JOIN TransactionSource ON t.sourceId = `;

      // return income[0]?._sum.amount ?? new Prisma.Decimal(0);
      return new Prisma.Decimal(0);
    }),
  categorizeAsFund: protectedProcedure
    .input(
      z.object({
        transactionId: z.string(),
        fundId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.update({
        where: {
          // userId: ctx.session.user.id,
          id: input.transactionId,
        },
        data: {
          isTransfer: false,
          source: {
            create: {
              type: "fund",
              fund: {
                connect: { id: input.fundId },
              },
            },
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
      return ctx.prisma.transaction.update({
        where: {
          // userId: ctx.session.user.id,
          id: input.transactionId,
        },
        data: {
          isTransfer: false,
          source: {
            create: {
              type: "budget",
              fund: {
                connect: { id: input.budgetId },
              },
            },
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
          date: today.toDateString(),
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
