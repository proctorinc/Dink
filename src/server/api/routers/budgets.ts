import {
  Prisma,
  type Transaction,
  type Budget,
  type Fund,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getLastDayOfMonth,
} from "~/utils";
import { sumTransactions } from "./transactions";

type BudgetAmount = {
  spent: Prisma.Decimal;
};

function sumTransactionsFromSources(
  sources: {
    transaction: Transaction;
  }[]
) {
  return sources.reduce((acc, source) => {
    return Prisma.Decimal.add(acc, source.transaction.amount);
  }, new Prisma.Decimal(0));
}

function sumBudgetTransactions(
  budgets: (Budget & {
    sourceTransactions: {
      transaction: Transaction;
    }[];
    savingsFund: Fund | null;
  })[]
) {
  return budgets.map(addBudgetAmounts);
}

export function addBudgetAmounts(
  budget: Budget & {
    sourceTransactions: {
      transaction: Transaction;
    }[];
    savingsFund: Fund | null;
  }
) {
  const { sourceTransactions, ...otherFields } = budget;
  let spent = sumTransactionsFromSources(sourceTransactions);
  const leftover = Prisma.Decimal.add(budget.goal, spent);

  if (Number(spent) !== 0) {
    spent = Decimal.mul(spent, new Decimal(-1));
  }

  return {
    ...otherFields,
    spent,
    leftover,
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
  getAllData: protectedProcedure.query(async ({ ctx }) => {
    const spendingBudgets = await ctx.prisma.budget.findMany({
      where: {
        userId: ctx.session.user.id,
        savingsFund: null,
      },
      include: {
        savingsFund: true,
        sourceTransactions: {
          include: {
            transaction: true,
          },
        },
      },
    });

    const savingsBudgets = await ctx.prisma.budget.findMany({
      where: {
        userId: ctx.session.user.id,
        NOT: [{ savingsFund: null }],
      },
      include: {
        savingsFund: true,
        sourceTransactions: {
          include: {
            transaction: true,
          },
        },
      },
    });

    return {
      spending: sumBudgetTransactions(spendingBudgets),
      saving: sumBudgetTransactions(savingsBudgets),
    };
  }),
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
          savingsFund: null,
          startDate: {
            lte: input.startOfMonth,
          },
          OR: [
            { endDate: { equals: null } },
            {
              endDate: {
                gte: input.endOfMonth,
              },
            },
          ],
        },
        include: {
          savingsFund: true,
          sourceTransactions: {
            include: {
              transaction: true,
            },
            where: {
              transaction: {
                date: {
                  gte: input.startOfMonth,
                  lte: input.endOfMonth,
                },
              },
            },
          },
        },
      });
      const savingsBudgets = await ctx.prisma.budget.findMany({
        where: {
          userId: ctx.session.user.id,
          NOT: { savingsFund: null },
          startDate: {
            lte: input.startOfMonth,
          },
          OR: [
            { endDate: { equals: null } },
            {
              endDate: {
                gte: input.endOfMonth,
              },
            },
          ],
        },
        include: {
          savingsFund: true,
          sourceTransactions: {
            include: {
              transaction: true,
            },
            where: {
              transaction: {
                date: {
                  gte: input.startOfMonth,
                  lte: input.endOfMonth,
                },
              },
            },
          },
        },
      });

      const spendingWithAmounts = sumBudgetTransactions(spendingBudgets);
      const savingsWithAmounts = sumBudgetTransactions(savingsBudgets);

      savingsBudgets.map(async (budget) => {
        const fundId: string = budget.savingsFundId ?? "";
        if (
          budget.sourceTransactions &&
          budget.sourceTransactions.length === 0
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
              amount: budget?.goal ?? 0,
              date: today,
              datetime: today,
              isPending: false,
              isTransfer: false,
              user: {
                connect: { id: ctx.session.user.id },
              },
              source: {
                create: {
                  type: "savings",
                  fund: {
                    connect: { id: fundId },
                  },
                  budget: {
                    connect: { id: budget?.id },
                  },
                },
              },
            },
            select: {
              source: true,
            },
          });
        }
      });
      const spendingTotal = sumTotalBudgetSpent(spendingWithAmounts);
      const spendingGoal = sumBudgetGoals(spendingWithAmounts);
      const savingsTotal = Decimal.abs(sumTotalBudgetSpent(savingsWithAmounts));
      const savingsGoal = sumBudgetGoals(savingsWithAmounts);

      const overallGoal = Decimal.add(savingsGoal, spendingGoal);
      const overallSpending = Decimal.add(
        savingsTotal,
        Decimal.abs(spendingTotal)
      );
      const overallLeftover = Decimal.sub(overallGoal, overallSpending);

      const uncategorizedTransactions = await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          source: null,
          date: {
            gte: input.startOfMonth,
            lte: input.endOfMonth,
          },
        },
      });

      return {
        overall: {
          goal: overallGoal,
          spent: Decimal.abs(overallSpending),
          leftover: overallLeftover,
        },
        uncategorized: {
          count: uncategorizedTransactions.length,
          total: sumTransactions(uncategorizedTransactions),
          transactions: uncategorizedTransactions,
        },
        spending: {
          budgets: spendingWithAmounts,
          total: Decimal.abs(spendingTotal),
          goal: spendingGoal,
          leftover: Prisma.Decimal.sub(spendingGoal, spendingTotal),
        },
        savings: {
          budgets: savingsWithAmounts,
          total: savingsTotal,
          goal: savingsGoal,
          leftover: Prisma.Decimal.sub(savingsGoal, savingsTotal),
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
          sourceTransactions: {
            include: {
              transaction: true,
            },
            orderBy: {
              transaction: {
                date: "desc",
              },
            },
          },
        },
      });
      if (!budget) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Budget does not exist",
        });
      }
      const { sourceTransactions, goal, ...budgetFields } = budget;

      const spent = sourceTransactions.reduce((acc, source) => {
        return Decimal.add(acc, source.transaction.amount);
      }, new Decimal(0));

      const leftover = Decimal.add(goal, spent);

      return {
        ...budgetFields,
        sourceTransactions,
        spent: Decimal.mul(spent, new Decimal(-1)),
        goal,
        leftover,
      };
    }),
  createSpending: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        goal: z.number(),
        icon: z.string(),
        color: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.budget.create({
        data: {
          icon: input.icon,
          name: input.name,
          goal: input.goal,
          color: input.color,
          startDate: getFirstDayOfMonth(new Date()),
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
            startDate: getFirstDayOfMonth(new Date()),
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
      const today = new Date();
      const endOfLastMonth = getLastDayOfLastMonth();
      const budget = await ctx.prisma.budget.findFirst({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
      });

      await ctx.prisma.transactionSource.deleteMany({
        where: {
          budgetId: input.budgetId,
          transaction: {
            userId: ctx.session.user.id,
            date: {
              lte: getLastDayOfMonth(today),
              gte: getFirstDayOfMonth(today),
            },
          },
        },
      });

      if (budget?.startDate && budget?.startDate > endOfLastMonth) {
        return ctx.prisma.budget.deleteMany({
          where: {
            id: input.budgetId,
            userId: ctx.session.user.id,
          },
        });
      }
      return ctx.prisma.budget.updateMany({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
        data: {
          endDate: endOfLastMonth,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        budgetId: z.string(),
        icon: z.string(),
        color: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.budget.updateMany({
        where: {
          id: input.budgetId,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name,
          icon: input.icon,
          color: input.color,
        },
      });
    }),
});
