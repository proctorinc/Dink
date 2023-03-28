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
});
