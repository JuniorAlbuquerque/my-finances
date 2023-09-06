import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";
import { cardRouter } from "./routers/card";
import { userRouter } from "./routers/user";
import { expensesRouter } from "./routers/expenses";
import { inflowsRouter } from "./routers/inflows";
import { reportRouter } from "./routers/report";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  card: cardRouter,
  user: userRouter,
  expense: expensesRouter,
  inflows: inflowsRouter,
  report: reportRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
