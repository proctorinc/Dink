import { Prisma, type Transaction, type Budget } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumBudgetGoals(budgets: Budget[]) {
  return budgets.reduce((acc, budget) => {
    return Prisma.Decimal.add(acc, budget.goal ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

function sumBudgetTransactions(
  budgets: (Budget & {
    source_transactions: Transaction[];
  })[]
) {
  return budgets.reduce((acc, budget) => {
    return Prisma.Decimal.add(
      acc,
      budget.source_transactions.reduce((acc, transaction) => {
        return Prisma.Decimal.add(
          acc,
          transaction.amount ?? new Prisma.Decimal(0)
        );
      }, new Prisma.Decimal(0))
    );
  }, new Prisma.Decimal(0));
}

export const budgetsRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.prisma.budget.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        source_transactions: true,
      },
    });
    const goal = sumBudgetGoals(budgets);
    const spent = sumBudgetTransactions(budgets);

    return {
      goal: goal,
      spent: spent,
      leftover: Prisma.Decimal.sub(goal, spent),
      budgets: budgets,
    };
  }),
});
