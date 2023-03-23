import { Prisma } from "@prisma/client";
import type { Budget } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

function sumBudgetGoals(budgets: Budget[]) {
  return budgets.reduce((acc, budget) => {
    return Prisma.Decimal.add(acc, budget.goal ?? new Prisma.Decimal(0));
  }, new Prisma.Decimal(0));
}

export const budgetsRouter = createTRPCRouter({
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const budgets = await ctx.prisma.budget.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const goal = sumBudgetGoals(budgets);
    const spent = new Prisma.Decimal(0);

    return {
      goal: goal,
      spent: spent,
      leftover: Prisma.Decimal.sub(goal, spent),
      budgets: budgets,
    };
  }),
});
