import { faker } from "@faker-js/faker";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

enum AccountType {
  Credit = "credit",
  Depository = "depository",
  Loan = "loan",
  Investment = "investment",
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
  addMockFund: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fund.create({
        data: {
          icon: "",
          initial_amount: faker.datatype.float({ precision: 0.01 }),
          name: `${faker.word.adjective()} ${faker.word.noun()}`,
          user: {
            connect: { id: input.userId },
          },
        },
      });
    }),
  addMockBudget: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.budget.create({
        data: {
          icon: "",
          goal: faker.datatype.float({ precision: 0.01 }),
          name: `${faker.word.adjective()} ${faker.word.noun()}`,
          user: {
            connect: { id: input.userId },
          },
        },
      });
    }),
  addMockTransaction: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        accountId: z.string(),
        categoryId: z.string(),
        budgetId: z.string(),
        fundId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const date = faker.date
        .between("2023-01-01T00:00:00.000Z", new Date())
        .toDateString();
      return ctx.prisma.transaction.create({
        data: {
          account_owner: "",
          amount: faker.datatype.float({ precision: 0.01 }),
          authorized_datetime: date,
          checkNumber: "",
          date: date,
          datetime: date,
          isSavings: false,
          isTransfer: false,
          isoCurrencyCode: "",
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          country: faker.address.country(),
          lat: faker.address.latitude(),
          lon: faker.address.longitude(),
          postal_code: faker.address.zipCode(),
          region: "",
          store_number: "",
          merchantName: "",
          name: "",
          note: "",
          paymentChannel: "",
          by_order_of: "",
          payee: "",
          payer: "",
          payment_method: faker.finance.transactionType(),
          payment_processor: "",
          ppd_id: "",
          reason: "",
          reference_number: faker.finance.mask(),
          pending: false,
          pendingTransactionId: "",
          personalFinanceCategory: "",
          transactionCode: "",
          transactionId: "",
          transactionType: "",
          unofficialCurrencyCode: "",
          user: {
            connect: { id: input.userId },
          },
          account: {
            connect: { id: input.accountId },
          },
          category: {
            connect: { id: input.categoryId },
          },
          fundSource: {
            connect: { id: input.fundId },
          },
          budgetSource: {
            connect: { id: input.budgetId },
          },
        },
      });
    }),
});
