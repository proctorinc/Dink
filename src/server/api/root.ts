import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/users";
import { bankAccountRouter } from "./routers/bankAccounts";
import { budgetsRouter } from "./routers/budgets";
import { fundsRouter } from "./routers/funds";
import { transactionsRouter } from "./routers/transactions";
import { plaidRouter } from "./routers/plaid/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  bankAccounts: bankAccountRouter,
  budgets: budgetsRouter,
  funds: fundsRouter,
  transactions: transactionsRouter,
  plaid: plaidRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
