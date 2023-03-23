import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const fundsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.fund.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
