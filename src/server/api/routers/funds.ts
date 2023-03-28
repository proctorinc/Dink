import { type Fund, Prisma } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type TransactionAmount = {
  amount: Prisma.Decimal;
};

type FundAmount = {
  amount: Prisma.Decimal;
};

function sumTransactions(transactions: TransactionAmount[]) {
  return transactions.reduce((acc, transaction) => {
    return Prisma.Decimal.add(acc, transaction.amount);
  }, new Prisma.Decimal(0));
}

function sumTotalFundAmount(funds: (Fund & FundAmount)[]) {
  return funds.reduce((acc, fund) => {
    return Prisma.Decimal.add(acc, fund.amount);
  }, new Prisma.Decimal(0));
}

function sumFundTransactions(
  funds: (Fund & {
    source_transactions: TransactionAmount[];
  })[]
) {
  return funds.map((fund) => {
    const { source_transactions, ...otherFields } = fund;
    return {
      ...otherFields,
      amount: sumTransactions(source_transactions),
    };
  });
}

export const fundsRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const funds = await ctx.prisma.fund.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        source_transactions: {
          select: {
            amount: true,
          },
        },
      },
    });
    const fundsWithAmounts = sumFundTransactions(funds);

    console.log(sumTotalFundAmount(fundsWithAmounts));

    return {
      total: sumTotalFundAmount(fundsWithAmounts),
      funds: fundsWithAmounts,
    };
  }),
});
