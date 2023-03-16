import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bankAccountRouter = createTRPCRouter({
  deleteBankAccount: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.bankAccount.delete({
        where: {
          id: input.accountId,
        },
      });
    }),
});
