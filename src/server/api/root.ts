import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { mockDataRouter } from "./routers/mock_data";
import { userRouter } from "./routers/users";
import { bankAccountRouter } from "./routers/bankAccounts";
import { budgetsRouter } from "./routers/budgets";
import { fundsRouter } from "./routers/funds";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  mockData: mockDataRouter,
  users: userRouter,
  bankAccounts: bankAccountRouter,
  budgets: budgetsRouter,
  funds: fundsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
