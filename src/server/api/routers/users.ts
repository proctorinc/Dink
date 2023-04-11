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
        where: {
          id: ctx.session.user.id,
        },
        data: {
          nickname: input.name,
        },
      });
    }),
  updateTargetIncome: protectedProcedure
    .input(z.object({ income: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          targetIncome: input.income,
        },
      });
    }),
  updateCreditUtilization: protectedProcedure
    .input(z.object({ utilization: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          creditPercentTarget: input.utilization,
        },
      });
    }),
  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        creditPercentTarget: true,
        targetIncome: true,
      },
    });
  }),
});
