import {
  type Fund,
  Prisma,
  type TransactionSource,
  type Transaction,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AccountCategory } from "~/config";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type FundAmount = {
  amount: Prisma.Decimal;
};

function sumTransactions(
  sources: (TransactionSource & {
    transaction: Transaction;
  })[]
) {
  return sources.reduce((acc, source) => {
    return Prisma.Decimal.add(acc, source.transaction.amount);
  }, new Prisma.Decimal(0));
}

function sumTotalFundAmount(funds: (Fund & FundAmount)[]) {
  return funds.reduce((acc, fund) => {
    return Prisma.Decimal.add(acc, fund.amount);
  }, new Prisma.Decimal(0));
}

function sumFundTransactions(
  funds: (Fund & {
    sourceTransactions: (TransactionSource & {
      transaction: Transaction;
    })[];
  })[]
) {
  return funds.map((fund) => addAmountToFund(fund));
}

function addAmountToFund(
  fund: Fund & {
    sourceTransactions: (TransactionSource & {
      transaction: Transaction;
    })[];
  }
) {
  const { sourceTransactions, ...otherFields } = fund;
  return {
    ...otherFields,
    sourceTransactions,
    amount: sumTransactions(sourceTransactions),
  };
}

export const fundsRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const funds = await ctx.prisma.fund.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        sourceTransactions: {
          include: {
            transaction: true,
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
        ignore: false,
      },
    });

    const fundsWithAmounts = sumFundTransactions(funds);
    const fundsTotal = sumTotalFundAmount(fundsWithAmounts);
    const accountsPositiveBalance = accountTotals.reduce((acc, account) => {
      if (
        account.type === AccountCategory.Cash ||
        account.type === AccountCategory.Investment
      ) {
        return Prisma.Decimal.add(
          acc,
          account._sum.current ?? new Prisma.Decimal(0)
        );
      }
      return acc;
    }, new Prisma.Decimal(0));

    return {
      total: fundsTotal,
      available: accountsPositiveBalance,
      unallocatedTotal: Prisma.Decimal.sub(accountsPositiveBalance, fundsTotal),
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
          sourceTransactions: {
            include: {
              transaction: true,
            },
          },
        },
      });

      if (!fund) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fund does not exist",
        });
      }

      return addAmountToFund(fund);
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
      await ctx.prisma.transactionSource.deleteMany({
        where: {
          fundId: input.fundId,
          transaction: {
            userId: ctx.session.user.id,
          },
        },
      });
      return ctx.prisma.fund.deleteMany({
        where: {
          id: input.fundId,
          userId: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ fundId: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.fund.updateMany({
        where: {
          id: input.fundId,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
