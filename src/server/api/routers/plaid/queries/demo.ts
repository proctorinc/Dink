import institutionsJson from "../../../../data/institutions.json";
import savingsFundsJson from "../../../../data/savings.json";
import budgetsJson from "../../../../data/budgets.json";
import { getFirstDayOfMonth } from "~/utils";
import { z } from "zod";
import { type PrismaClient } from "@prisma/client";

const demoInstitutionsSchema = z
  .object({
    name: z.string(),
    logo: z.string(),
    url: z.string(),
    primaryColor: z.string(),
    accounts: z
      .object({
        available: z.number().nullable(),
        current: z.number(),
        isoCurrencyCode: z.string(),
        unofficialCurrencyCode: z.string(),
        creditLimit: z.number().nullable(),
        mask: z.string(),
        name: z.string(),
        officialName: z.string().nullable(),
        subtype: z.string(),
        type: z.string(),
        creditClosingDay: z.number().nullable(),
        ignore: z.boolean(),
      })
      .array(),
  })
  .array();

const demoFundsSchema = z
  .object({
    icon: z.string(),
    name: z.string(),
    budget: z.object({
      goal: z.number(),
      name: z.string(),
    }),
    allocation: z.object({
      name: z.string(),
      amount: z.number(),
    }),
  })
  .array();

const demoBudgetsSchema = z
  .object({
    goal: z.number(),
    icon: z.string(),
    name: z.string(),
  })
  .array();

export function loadDemoData(userId: string, prisma: PrismaClient) {
  const institutions = demoInstitutionsSchema.parse(institutionsJson);

  institutions.map(async (institutionData) => {
    const itemId = `${userId}-demo-${institutionData.name}`;
    const institution = await prisma.institution.create({
      data: {
        name: institutionData.name,
        logo: Buffer.from(String(institutionData.logo), "utf-8"),
        url: institutionData.url,
        primaryColor: institutionData.primaryColor,
        syncItem: {
          create: {
            plaidId: itemId,
            accessToken: `${itemId}-access-token`,
            status: "demo",
          },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
    institutionData.accounts.map(async (bankAccount) => {
      await prisma.bankAccount.create({
        data: {
          plaidId: `${userId}-demo-${bankAccount.name}`,
          ...bankAccount,
          user: {
            connect: { id: userId },
          },
          institution: {
            connect: { id: institution.id },
          },
        },
      });
    });
  });

  const savingsFunds = demoFundsSchema.parse(savingsFundsJson);

  savingsFunds.map(async (fund) => {
    const today = new Date();
    const budget = fund.budget;
    const allocation = fund.allocation;
    const savingsFund = await prisma.fund.create({
      data: {
        icon: fund.icon,
        name: fund.name,
        user: {
          connect: { id: userId },
        },
      },
    });

    await prisma.budget.create({
      data: {
        icon: fund.icon,
        goal: budget.goal,
        name: budget.name,
        startDate: getFirstDayOfMonth(new Date()),
        savingsFund: {
          connect: { id: savingsFund.id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });

    await prisma.transaction.create({
      data: {
        name: allocation.name,
        note: "",
        isTransfer: false,
        amount: allocation.amount,
        date: today,
        datetime: today,
        isPending: false,
        user: {
          connect: { id: userId },
        },
        source: {
          create: {
            type: "savings",
            fund: {
              connect: { id: savingsFund.id },
            },
          },
        },
      },
    });
  });

  const budgets = demoBudgetsSchema.parse(budgetsJson);

  budgets.map(async (budget) => {
    await prisma.budget.create({
      data: {
        icon: budget.icon,
        name: budget.name,
        goal: budget.goal,
        startDate: getFirstDayOfMonth(new Date()),
        user: {
          connect: { id: userId },
        },
      },
    });
  });
}
