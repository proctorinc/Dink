import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const transactionsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.transaction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
