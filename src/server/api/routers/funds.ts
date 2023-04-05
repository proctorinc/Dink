import { type Fund, Prisma, type Transaction } from "@prisma/client";
import { z } from "zod";
import { AccountCategory } from "~/config";
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
  return funds.map((fund) => addAmountToFund(fund));
}

function addAmountToFund(
  fund: Fund & {
    source_transactions: TransactionAmount[];
  }
) {
  const { source_transactions, ...otherFields } = fund;
  return {
    ...otherFields,
    amount: sumTransactions(source_transactions),
  };
}

function addAmountToFundWithTransactions(
  fund: Fund & {
    source_transactions: Transaction[];
  }
) {
  const { source_transactions, ...otherFields } = fund;
  return {
    ...otherFields,
    source_transactions,
    amount: sumTransactions(source_transactions),
  };
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
    const accountTotals = await ctx.prisma.bankAccount.groupBy({
      by: ["type"],
      _sum: {
        current: true,
      },
      where: {
        userId: ctx.session.user.id,
      },
    });

    const fundsWithAmounts = sumFundTransactions(funds);
    const fundsTotal = sumTotalFundAmount(fundsWithAmounts);
    const accountsTotalBalance = accountTotals.reduce((acc, account) => {
      if (
        account.type === AccountCategory.Cash ||
        account.type === AccountCategory.Investment
      ) {
        return Prisma.Decimal.add(
          acc,
          account._sum.current ?? new Prisma.Decimal(0)
        );
      }
      return Prisma.Decimal.sub(
        acc,
        account._sum.current ?? new Prisma.Decimal(0)
      );
    }, new Prisma.Decimal(0));

    return {
      total: fundsTotal,
      unallocatedTotal: Prisma.Decimal.sub(accountsTotalBalance, fundsTotal),
      funds: fundsWithAmounts,
    };
  }),
  getById: protectedProcedure
    .input(
      z.object({
        fundId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const fund = await ctx.prisma.fund.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.fundId,
        },
        include: {
          source_transactions: true,
        },
      });

      return fund ? addAmountToFundWithTransactions(fund) : fund;
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), icon: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fund.create({
        data: {
          icon: input.icon,
          name: input.name,
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ fundId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.transaction.updateMany({
        where: {
          fundSourceId: input.fundId,
          userId: ctx.session.user.id,
        },
        data: {
          sourceType: null,
          fundSourceId: null,
        },
      });
      return ctx.prisma.fund.deleteMany({
        where: {
          id: input.fundId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
