import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        bankAccounts: true,
        funds: true,
        budgets: true,
      },
    });
  }),
  deleteUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.delete({
        where: {
          id: input.userId,
        },
      });
    }),
  updateNickname: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          nickname: input.name,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
