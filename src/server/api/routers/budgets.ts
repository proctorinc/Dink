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
      const budgets = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.session.user.id,
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
  create: protectedProcedure
    .input(z.object({ name: z.string(), goal: z.number(), icon: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.budget.create({
        data: {
          icon: input.icon,
          name: input.name,
          goal: input.goal,
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
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
});
