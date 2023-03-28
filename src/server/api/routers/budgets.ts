import { Prisma, type Budget } from "@prisma/client";
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
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.prisma.budget.findMany({
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
    const budgetsWithAmounts = sumBudgetTransactions(budgets);
    const spent = sumTotalBudgetSpent(budgetsWithAmounts);
    const goal = sumBudgetGoals(budgets);

    return {
      goal: goal,
      spent: spent,
      leftover: Prisma.Decimal.sub(goal, spent),
      budgets: budgetsWithAmounts,
    };
  }),
});
