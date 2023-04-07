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
      })
    )
    .query(async ({ input, ctx }) => {
      const monthFilter = {
        date: {
          gte: input.startOfMonth,
          lte: input.endOfMonth,
        },
      };
      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.filterMonthly ? monthFilter : {}),
          OR: [
            {
              ...(input.includeSavings ? { sourceType: "savings" } : {}),
            },
            {
              ...(input.includeUncategorized ? { sourceType: null } : {}),
            },
            {
              ...(input.includeCategorized ? { sourceType: "fund" } : {}),
            },
            {
              ...(input.includeCategorized ? { sourceType: "budget" } : {}),
            },
          ],
        },
        orderBy: {
          date: "desc",
        },
        include: {
          budgetSource: true,
          fundSource: true,
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
        budgetSource: true,
        fundSource: true,
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
          date: {
            gte: input.startOfMonth,
            lte: input.endOfMonth,
          },
        },
        orderBy: {
          date: "desc",
        },
        include: {
          budgetSource: true,
          fundSource: true,
        },
      });
    }),
  getUncategorized: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
        sourceType: null,
      },
      include: {
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
      const income = await ctx.prisma.transaction.groupBy({
        by: ["sourceType"],
        where: {
          userId: ctx.session.user.id,
          sourceType: "income",
          date: {
            gte: input.startOfMonth,
            lte: input.endOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      return income[0]?._sum.amount ?? new Prisma.Decimal(0);
    }),
  categorizeAsFund: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        sourceId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.id ?? "",
        },
        data: {
          sourceType: "fund",
          fundSourceId: input.sourceId,
        },
      });
    }),
  categorizeAsBudget: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        sourceId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.id ?? "",
        },
        data: {
          sourceType: "budget",
          budgetSourceId: input.sourceId,
        },
      });
    }),
  categorizeAsIncome: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.id ?? "",
        },
        data: {
          sourceType: "income",
        },
      });
    }),
  sumAllTransactionsMonthly: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma
      .$queryRaw`SELECT * FROM dink.Transaction, DATE_FORMAT(date, '%m-%Y') AS date_created WHERE userId = ${ctx.session.user.id} GROUP BY MONTH(date_created), YEAR(date_created);`;
    console.log(data);
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
      const data = {
        name: input.name,
        note: "",
        isTransfer: false,
        transactionId: "savings",
        amount: input.amount,
        date: today,
        pending: false,
        user: {
          connect: { id: ctx.session.user.id },
        },
        fundSource: {
          connect: { id: input.fundId },
        },
        sourceType: "savings",
      };
      return ctx.prisma.transaction.create({
        data,
      });
    }),
});
