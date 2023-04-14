import {
  type BankAccount,
  Prisma,
  type PlaidItem,
  type Institution,
  type Transaction,
  type Fund,
  type Budget,
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
    item: PlaidItem & {
      institution: Institution | null;
    };
  })[]
) {
  return accounts.map((account) => {
    return convertLogoBufferToString(account);
  });
}

function convertLogoBufferToString(
  account: BankAccount & {
    item: PlaidItem & {
      institution: Institution | null;
    };
  }
) {
  const { item, ...accountValues } = account;
  if (item.institution && item.institution.logo) {
    const { institution, ...itemValues } = item;
    const { logo: blob, ...institutionValues } = institution;

    const logo = blob?.toString("utf-8");

    return {
      ...accountValues,
      item: {
        ...itemValues,
        institution: {
          ...institutionValues,
          logo: logo ?? null,
        },
      },
    };
  }
  return account;
}

function convertLogoBufferToStringWithTransactions(
  account: BankAccount & {
    transactions: (Transaction & {
      fundSource: Fund | null;
      budgetSource: Budget | null;
    })[];
    item: PlaidItem & {
      institution: Institution | null;
    };
  }
) {
  const { item, ...accountValues } = account;
  if (item.institution && item.institution.logo) {
    const { institution, ...itemValues } = item;
    const { logo: blob, ...institutionValues } = institution;

    const logo = blob?.toString("utf-8");

    return {
      ...accountValues,
      item: {
        ...itemValues,
        institution: {
          ...institutionValues,
          logo: logo ?? null,
        },
      },
    };
  }
  return account;
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
        item: {
          include: {
            institution: true,
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
        item: {
          include: {
            institution: true,
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
        item: {
          include: {
            institution: true,
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
        item: {
          include: {
            institution: true,
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
          item: {
            include: {
              institution: true,
            },
          },
          transactions: {
            include: {
              fundSource: true,
              budgetSource: true,
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
  create: protectedProcedure
    .input(
      z.object({
        plaidItemId: z.string(),
        accounts: z
          .object({
            id: z.string(),
            plaidId: z.string(),
            available: z.number().nullable().optional(),
            current: z.number().optional(),
            iso_currency_code: z.string().optional(),
            limit: z.number().optional(),
            unofficial_currency_code: z.string().optional(),
            mask: z.string(),
            name: z.string(),
            official_name: z.string().optional(),
            subtype: z.string(),
            type: z.string(),
          })
          .array()
          .min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      // const data = input.accounts.map((account) => {
      //   return {};
      // });
      // return ctx.prisma.bankAccount.createMany({
      //   data: {
      //     plaidAccountId: account.plaidId,
      //     available: account.available,
      //     current: account.current,
      //     iso_currency_code: account?.iso_currency_code ?? null,
      //     limit: account.limit,
      //     unofficial_currency_code: account.unofficial_currency_code,
      //     mask: account.mask,
      //     name: account.name,
      //     official_name: account.official_name,
      //     subtype: account.subtype,
      //     type: account.type === "other" ? "cash" : account.type,
      //     user: {
      //       connect: { id: ctx.session.user.id },
      //     },
      //     item: {
      //       connect: { id: input.plaidItemId },
      //     },
      //   },
      // });

      input.accounts.map(async (account) => {
        await ctx.prisma.bankAccount.create({
          data: {
            plaidAccountId: account.plaidId,
            available: account.available,
            current: account.current,
            iso_currency_code: account?.iso_currency_code ?? null,
            limit: account.limit,
            unofficial_currency_code: account.unofficial_currency_code,
            mask: account.mask,
            name: account.name,
            official_name: account.official_name,
            subtype: account.subtype,
            type: account.type === "other" ? "cash" : account.type,
            user: {
              connect: { id: ctx.session.user.id },
            },
            item: {
              connect: { id: input.plaidItemId },
            },
          },
        });
      });
      return;
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
