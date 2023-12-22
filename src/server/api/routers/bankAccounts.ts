import { type Serie } from "@nivo/line";
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
import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";
import { AccountCategory } from "~/config";
import {
  createTRPCRouter,
  protectedProcedure,
  userProcedure,
} from "~/server/api/trpc";

type NetMonthlySpending = {
  month: string;
  spent: Decimal;
};

function sumAccountsBalance(accounts: BankAccount[]) {
  return accounts.reduce((acc, account) => {
    return Prisma.Decimal.add(acc, account.current ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

export function convertAccountLogosToString(
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

export function convertLogoBufferToString(
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

export function convertLogoBufferToStringWithTransactions(
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

function convertInstitutionsLogostoStrings(
  institutions: (Institution & {
    linkedAccounts: BankAccount[];
    syncItem: InstitutionSyncItem | null;
  })[]
) {
  return institutions.map((institution) => {
    const { logo: blob, ...institutionValues } = institution;

    return {
      ...institutionValues,
      logo: blob ? blob?.toString("utf-8") : null,
    };
  });
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

    const userId = ctx.session.user.id;
    const netSpendingByMonth: NetMonthlySpending[] = await ctx.prisma.$queryRaw`
      SELECT
        DATE_FORMAT(t.date, '%Y-%m') as month,
        SUM(t.amount) AS spent
      FROM dink.Transaction as t
      LEFT JOIN dink.TransactionSource as ts
      ON t.id = ts.transactionId
      WHERE
        t.userId = ${userId}
        AND (
          ts.type IS NULL
          OR ts.type = 'fund'
          OR ts.type = 'budget'
        )
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `;
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

    let monthlyTotal = total;

    const chartData: Serie[] = [
      {
        id: "Line",
        data: netSpendingByMonth.map((monthSpending, index) => {
          monthlyTotal = Decimal.sub(monthlyTotal, monthSpending.spent);
          return {
            x: index,
            y: Math.abs(Number(monthlyTotal)),
          };
        }),
      },
    ];

    return {
      count: allAccounts.length,
      total: total,
      chartData,
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
  delete: userProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.bankAccount.deleteMany({
        where: {
          id: input.accountId,
          userId: ctx.session.user.id,
        },
      });
    }),
  getInstitutions: protectedProcedure.query(async ({ ctx }) => {
    const institutions = await ctx.prisma.institution.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        linkedAccounts: true,
        syncItem: true,
      },
    });

    return convertInstitutionsLogostoStrings(institutions);
  }),
});
