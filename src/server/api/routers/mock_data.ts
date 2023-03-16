import { faker } from "@faker-js/faker";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

enum AccountType {
  Credit = "credit",
  Depository = "depository",
  Loan = "loan",
  Investment = "investment",
  Other = "other",
}

const AccountSubtypes = {
  [AccountType.Credit]: ["credit card", "paypal"],
  [AccountType.Depository]: [
    "checking",
    "savings",
    "hsa",
    "cd",
    "money market",
    "paypal",
    "prepaid",
    "cash management",
    "ebt",
  ],
  [AccountType.Loan]: [
    "auto",
    "business",
    "commercial",
    "construction",
    "consumer",
    "home equity",
    "loan",
    "mortgage",
    "overdraft",
    "line of credit",
    "student",
    "other",
  ],
  [AccountType.Investment]: [
    "529",
    "401a",
    "401k",
    "403B",
    "457b",
    "brokerage",
    "cash isa",
    "crypto exchange",
    "education savings account",
    "fixed annuity",
    "gic",
    "health reimbursement arrangement",
    "hsa",
    "ira",
    "isa",
    "keogh",
    "lif",
    "life insurance",
    "lira",
    "lrif",
    "lrsp",
    "mutual fund",
    "non-custodial wallet",
    "non-taxable brokerage account",
    "other",
    "other annuity",
    "other insurance",
    "pension",
    "prif",
    "profit sharing plan",
    "qshr",
    "rdsp",
    "resp",
    "retirement",
    "rlif",
    "roth",
    "roth 401k",
    "rrif",
    "rrsp",
    "sarsep",
    "sep ira",
    "simple ira",
    "sipp",
    "stock plan",
    "tfsa",
    "trust",
    "ugma",
    "utma",
    "variable annuity",
  ],
  [AccountType.Other]: ["other"],
};

export const mockDataRouter = createTRPCRouter({
  addMockUser: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.user.create({
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        emailVerified: faker.datatype.datetime(),
      },
    });
  }),
  addMockBankAccount: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      const type = faker.helpers.arrayElement([
        AccountType.Credit,
        AccountType.Depository,
        AccountType.Investment,
        AccountType.Loan,
        AccountType.Other,
      ]);
      const subtype = faker.helpers.arrayElement(AccountSubtypes[type]);

      return ctx.prisma.bankAccount.create({
        data: {
          available: null,
          current: faker.datatype.float({ precision: 0.01 }),
          iso_currency_code: "USD",
          limit: null,
          unofficial_currency_code: null,
          mask: faker.finance.mask(4, false, false),
          name: faker.finance.accountName(),
          official_name: faker.finance.accountName(),
          type: type,
          subtype: subtype,
          user: {
            connect: { id: input.userId },
          },
        },
      });
    }),
});
