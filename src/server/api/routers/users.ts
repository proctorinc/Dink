import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  setProfileComplete: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        isProfileComplete: true,
      },
    });
  }),
  getUserPreferences: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userPreferences.findUnique({
      where: {
        userId: ctx.session.user.id,
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
      return ctx.prisma.userPreferences.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        create: {
          targetIncome: input.income,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          targetIncome: input.income,
        },
      });
    }),
  completeProfile: protectedProcedure
    .input(z.object({ income: z.number(), nickname: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          nickname: input.nickname,
          isProfileComplete: true,
        },
      });
      return ctx.prisma.userPreferences.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        create: {
          targetIncome: input.income,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        update: {
          targetIncome: input.income,
        },
      });
    }),
  updateCreditUtilization: protectedProcedure
    .input(z.object({ utilization: z.number() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.userPreferences.update({
        where: {
          userId: ctx.session.user.id,
        },
        data: {
          creditPercentTarget: input.utilization,
        },
      });
    }),
});
