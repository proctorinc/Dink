import { Prisma, type Transaction, type Budget } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type TransactionAmount = {
  amount: Prisma.Decimal;
};

type BudgetAmount = {
  spent: Prisma.Decimal;
};

function sumTransactions(transactions: TransactionAmount[]) {
  return transactions.reduce((acc, transaction) => {
    return Prisma.Decimal.add(acc, transaction.amount);
  }, new Prisma.Decimal(0));
}

function sumBudgetTransactions(
  budgets: (Budget & {
    source_transactions: TransactionAmount[];
  })[]
) {
  return budgets.map((budget) => {
    const { source_transactions, ...otherFields } = budget;
    const spent = sumTransactions(source_transactions);
    return {
      ...otherFields,
      spent,
      leftover: Prisma.Decimal.sub(budget.goal, spent),
    };
  });
}

function addAmountToBudgetWithTransactions(
  fund: Budget & {
    source_transactions: Transaction[];
  }
) {
  const { source_transactions, ...otherFields } = fund;
  const spent = sumTransactions(source_transactions);
  return {
    ...otherFields,
    source_transactions,
    spent,
    leftover: Prisma.Decimal.sub(fund.goal, spent),
  };
}

function sumBudgetGoals(budgets: Budget[]) {
  return budgets.reduce((acc, budget) => {
    return Prisma.Decimal.add(acc, budget.goal ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

function sumTotalBudgetSpent(budgets: (Budget & BudgetAmount)[]) {
  return budgets.reduce((acc, budget) => {
    return Prisma.Decimal.add(acc, budget.spent);
  }, new Prisma.Decimal(0));
}

export const budgetsRouter = createTRPCRouter({
  getDataByMonth: protectedProcedure
    .input(
      z.object({
        startOfMonth: z.date(),
        endOfMonth: z.date(),
      })
    )
    .query(async ({ input, ctx }) => {
      const spendingBudgets = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.session.user.id,
          isSavings: false,
        },
        include: {
          source_transactions: {
            where: {
              date: {
                gte: input.startOfMonth,
                lte: input.endOfMonth,
              },
            },
            select: {
              amount: true,
            },
          },
        },
      });
      const savingsBudgets = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.session.user.id,
          isSavings: true,
        },
        include: {
          savingsFund: true,
          source_transactions: {
            where: {
              date: {
                gte: input.startOfMonth,
                lte: input.endOfMonth,
              },
            },
            select: {
              amount: true,
            },
          },
        },
      });

      const spendingWithAmounts = sumBudgetTransactions(spendingBudgets);
      const savingsWithAmounts = sumBudgetTransactions(savingsBudgets);

      savingsBudgets.map(async (budget) => {
        const fundId: string = budget.savingsFundId ?? "";
        if (
          budget.source_transactions &&
          budget.source_transactions.length === 0
        ) {
          const today = new Date();
          await ctx.prisma.transaction.upsert({
            where: {
              id: `${fundId}-${
                budget.id
              }-${today.getMonth()}-${today.getFullYear()}`,
            },
            update: {},
            create: {
              id: `${fundId}-${
                budget.id
              }-${today.getMonth()}-${today.getFullYear()}`,
              name: "Monthly Savings",
              note: "",
              isTransfer: false,
              isSavings: true,
              transactionId: "savings",
              amount: budget?.goal ?? 0,
              date: today,
              pending: false,
              user: {
                connect: { id: ctx.session.user.id },
              },
              fundSource: {
                connect: { id: fundId },
              },
              budgetSource: {
                connect: { id: budget?.id },
              },
              sourceType: "savings",
            },
            select: {
              fundSource: true,
              budgetSource: true,
            },
          });
        }
      });

      const spent = sumTotalBudgetSpent([
        ...spendingWithAmounts,
        ...savingsWithAmounts,
      ]);
      const goal = sumBudgetGoals([...spendingBudgets, ...savingsBudgets]);

      return {
        goal: goal,
        spent: spent,
        leftover: Prisma.Decimal.sub(goal, spent),
        budgets: {
          spending: spendingWithAmounts,
          savings: savingsWithAmounts,
        },
      };
    }),
  getById: protectedProcedure
    .input(
      z.object({
        startOfMonth: z.date(),
        endOfMonth: z.date(),
        budgetId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const budget = await ctx.prisma.budget.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.budgetId,
        },
        include: {
          source_transactions: {
            where: {
              date: {
                gte: input.startOfMonth,
                lte: input.endOfMonth,
              },
            },
            orderBy: {
              date: "desc",
            },
          },
        },
      });

      return budget ? addAmountToBudgetWithTransactions(budget) : budget;
    }),
  createSpending: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        goal: z.number(),
        icon: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.budget.create({
        data: {
          icon: input.icon,
          name: input.name,
          goal: input.goal,
          isSavings: false,
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  createSavings: protectedProcedure
    .input(
      z.object({
        goal: z.number(),
        fundId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const fund = await ctx.prisma.fund.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.fundId,
        },
      });

      if (!!fund) {
        return ctx.prisma.budget.create({
          data: {
            icon: fund?.icon ?? "",
            name: fund?.name,
            goal: input.goal,
            isSavings: true,
            savingsFund: { connect: { id: input.fundId } },
            user: {
              connect: { id: ctx.session.user.id },
            },
          },
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ budgetId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.transaction.updateMany({
        where: {
          budgetSourceId: input.budgetId,
          userId: ctx.session.user.id,
        },
        data: {
          sourceType: null,
          fundSourceId: null,
        },
      });
      return ctx.prisma.budget.deleteMany({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ budgetId: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.budget.updateMany({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
