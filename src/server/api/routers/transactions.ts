import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
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
  categorizeTransaction: protectedProcedure
    .input(
      z.object({
        id: z.string().nullable(),
        type: z.string().nullable(),
        sourceId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      if (input.type === "fund") {
        return ctx.prisma.transaction.updateMany({
          where: {
            userId: ctx.session.user.id,
            id: input.id ?? "",
          },
          data: {
            sourceType: input.type,
            fundSourceId: input.sourceId,
          },
        });
      }
      return ctx.prisma.transaction.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.id ?? "",
        },
        data: {
          sourceType: input.type,
          budgetSourceId: input.sourceId,
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
        isTransfer: true,
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
        sourceType: "allocation",
      };
      return ctx.prisma.transaction.create({
        data,
      });
    }),
});
