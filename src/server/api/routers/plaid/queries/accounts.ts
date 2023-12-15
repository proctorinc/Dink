import { TRPCError } from "@trpc/server";
import { type AccountBase } from "plaid";
import { prisma } from "~/server/db";

export async function createAccounts(
  userId: string,
  plaidItemId: string,
  accounts: AccountBase[]
) {
  const createdAccounts = accounts.map(async (account) => {
    const institution = await prisma.institution.findFirst({
      where: {
        syncItem: {
          plaidId: plaidItemId,
        },
      },
    });

    if (!institution) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "The institution you are linking an account to does not exist.",
      });
    }

    return await prisma.bankAccount.upsert({
      where: {
        plaidId: account.account_id,
      },
      create: {
        plaidId: account.account_id,
        available: account.balances.available,
        current: account.balances.current,
        isoCurrencyCode: account.balances.iso_currency_code,
        creditLimit: account.balances.limit,
        unofficialCurrencyCode: account.balances.unofficial_currency_code,
        mask: account.mask,
        name: account.name,
        officialName: account.official_name,
        subtype: account.subtype,
        type: account.type === "other" ? "cash" : account.type,
        user: {
          connect: { id: userId },
        },
        institution: {
          connect: { id: institution.id },
        },
      },
      update: {
        plaidId: account.account_id,
        available: account.balances.available,
        current: account.balances.current,
        isoCurrencyCode: account.balances.iso_currency_code,
        creditLimit: account.balances.limit,
        unofficialCurrencyCode: account.balances.unofficial_currency_code,
        mask: account.mask,
        name: account.name,
        officialName: account.official_name,
        subtype: account.subtype,
        type: account.type === "other" ? "cash" : account.type,
      },
    });
  });
  await Promise.all(createdAccounts);
}
