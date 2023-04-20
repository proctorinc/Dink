import {
  type BankAccount,
  Prisma,
  type InstitutionSyncItem,
  type Institution,
  type Transaction,
  type TransactionSource,
  type Budget,
  type Fund,
} from "@prisma/client";
import { z } from "zod";
import { AccountCategory } from "~/config";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumAccountsBalance(accounts: BankAccount[]) {
  return accounts.reduce((acc, account) => {
    return Prisma.Decimal.add(acc, account.current ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

function convertAccountLogosToString(
  accounts: (BankAccount & {
    institution: Institution & {
      syncItem: InstitutionSyncItem | null;
    };
  })[]
) {
  return accounts.map((account) => {
    return convertLogoBufferToString(account);
  });
}

function convertLogoBufferToString(
  account: BankAccount & {
    institution: Institution & {
      syncItem: InstitutionSyncItem | null;
    };
  }
) {
  const { institution, ...accountValues } = account;
  const { logo: blob, ...institutionValues } = institution;

  return {
    ...accountValues,
    institution: {
      ...institutionValues,
      logo: blob ? blob?.toString("utf-8") : null,
    },
  };
}

function convertLogoBufferToStringWithTransactions(
  account: BankAccount & {
    transactions: (Transaction & {
      source:
        | (TransactionSource & {
            budget: Budget | null;
            fund: Fund | null;
          })
        | null;
    })[];
    institution: Institution & {
      syncItem: InstitutionSyncItem | null;
    };
  }
) {
  const { institution, ...accountValues } = account;
  const { logo: blob, ...institutionValues } = institution;

  return {
    ...accountValues,
    institution: {
      ...institutionValues,
      logo: blob ? blob?.toString("utf-8") : null,
    },
  };
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
      include: {
        institution: {
          include: {
            syncItem: true,
          },
        },
      },
    });

    const creditAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Credit,
      },
      include: {
        institution: {
          include: {
            syncItem: true,
          },
        },
      },
    });

    const investmentAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Investment,
      },
      include: {
        institution: {
          include: {
            syncItem: true,
          },
        },
      },
    });

    const loanAccounts = await ctx.prisma.bankAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        type: AccountCategory.Loan,
      },
      include: {
        institution: {
          include: {
            syncItem: true,
          },
        },
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
          accounts: convertAccountLogosToString(cashAccounts),
        },
        [AccountCategory.Credit]: {
          total: creditBalance,
          accounts: convertAccountLogosToString(creditAccounts),
        },
        [AccountCategory.Investment]: {
          total: investmentBalance,
          accounts: convertAccountLogosToString(investmentAccounts),
        },
        [AccountCategory.Loan]: {
          total: loanBalance,
          accounts: convertAccountLogosToString(loanAccounts),
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
    .query(async ({ input, ctx }) => {
      const account = await ctx.prisma.bankAccount.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.accountId,
        },
        include: {
          institution: {
            include: {
              syncItem: true,
            },
          },
          transactions: {
            include: {
              source: {
                include: {
                  budget: true,
                  fund: true,
                },
              },
            },
            orderBy: {
              date: "desc",
            },
          },
        },
      });
      return account
        ? convertLogoBufferToStringWithTransactions(account)
        : null;
    }),
  delete: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.bankAccount.deleteMany({
        where: {
          id: input.accountId,
          userId: ctx.session.user.id,
        },
      });
    }),
});
