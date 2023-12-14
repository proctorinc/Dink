import { TRPCError } from "@trpc/server";
import { CountryCode, Products } from "plaid";
import { z } from "zod";
import plaidClient from "~/server/api/plaid";
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import {
  createInstitutionSync,
  retrievePlaidItemByInstitutionId,
} from "./queries/items";
import { exchangePublicToken } from "./queries/tokens";
import { syncTransactions } from "./update_transactions";

export const plaidRouter = createTRPCRouter({
  getLinkToken: userProcedure.mutation(async ({ ctx }) => {
    return await plaidClient
      .linkTokenCreate({
        user: {
          client_user_id: ctx.session.user.id,
        },
        client_name: "Dink",
        products: [Products.Transactions],
        country_codes: [CountryCode.Us],
        language: "en",
      })
      .then((response) => response.data.link_token);
  }),
  createInstitution: userProcedure
    .input(
      z.object({
        publicToken: z.string(),
        institutionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { publicToken, institutionId } = input;
      const userId = ctx.session.user.id;
      const existingInstitution = await retrievePlaidItemByInstitutionId(
        institutionId
      );

      if (existingInstitution) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have linked this institution",
        });
      }

      const { itemId, accessToken } = await exchangePublicToken(publicToken);
      await createInstitutionSync({
        userId,
        itemId,
        institutionId,
        accessToken,
      });

      await syncTransactions(userId, itemId);
    }),

  // syncInstitutions: userProcedure.mutation(async ({ ctx }) => {
  //   const institutions = await ctx.prisma.institution.findMany({
  //     where: {
  //       userId: ctx.session.user.id,
  //     },
  //     include: {
  //       syncItem: true,
  //     },
  //   });

  //   institutions.map(async (institution) => {
  //     if (institution.syncItem) {
  //       await syncTransactions(
  //         ctx.session.user.id,
  //         institution.syncItem.plaidId
  //       );
  //       // update the lastSynced date to now, check result as well? idkkkk
  //       if (
  //         institution.syncItem.updatedAt.getTime() - new Date().getTime() >
  //         1000 * 60 * 60 * 4 // 4 hours
  //       )
  //         await ctx.prisma.institutionSyncItem.update({
  //           where: {
  //             id: institution.syncItem.plaidId,
  //           },
  //           data: {
  //             updatedAt: new Date(),
  //           },
  //         });
  //     }
  //   });
  // }),
});
