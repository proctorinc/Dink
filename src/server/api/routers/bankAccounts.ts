import { type BankAccount, Prisma } from "@prisma/client";
import { z } from "zod";
import { AccountCategory } from "~/config";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumAccountsBalance(accounts: BankAccount[]) {
  return accounts.reduce((acc, account) => {
    return Prisma.Decimal.add(acc, account.current ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

export const bankAccountRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const allAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const cashAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Cash,
      },
    });

    const creditAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Credit,
      },
    });

    const investmentAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Investment,
      },
    });

    const loanAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Loan,
      },
    });

    const cashBalance = sumAccountsBalance(cashAccounts);
    const creditBalance = sumAccountsBalance(creditAccounts);
    const investmentBalance = sumAccountsBalance(investmentAccounts);
    const loanBalance = sumAccountsBalance(loanAccounts);
    const total = Prisma.Decimal.sub(
      Prisma.Decimal.sub(
        Prisma.Decimal.add(cashBalance, investmentBalance),
        creditBalance
      ),
      loanBalance
    );

    return {
      count: allAccounts.length,
      total: total,
      categories: {
        [AccountCategory.Cash]: {
          total: cashBalance,
          accounts: cashAccounts,
        },
        [AccountCategory.Credit]: {
          total: creditBalance,
          accounts: creditAccounts,
        },
        [AccountCategory.Investment]: {
          total: investmentBalance,
          accounts: investmentAccounts,
        },
        [AccountCategory.Loan]: {
          total: loanBalance,
          accounts: loanAccounts,
        },
      },
    };
  }),
  getCreditAccounts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Credit,
      },
    });
  }),
  getById: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.bankAccount.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.accountId,
        },
        include: {
          transactions: true,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.bankAccount.delete({
        where: {
          id: input.accountId,
        },
      });
    }),
});
