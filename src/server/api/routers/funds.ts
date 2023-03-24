import { type Fund, Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumFundsBalance(funds: Fund[]) {
  return funds.reduce((acc, fund) => {
    return Prisma.Decimal.add(
      acc,
      fund.initial_amount ?? new Prisma.Decimal(0)
    );
  }, new Prisma.Decimal(0));
}

export const fundsRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const funds = await ctx.prisma.fund.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return {
      amount: sumFundsBalance(funds),
      funds: funds,
    };
  }),
});
