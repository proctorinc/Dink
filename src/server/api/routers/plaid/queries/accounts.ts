import { type AccountBase } from "plaid";
import { prisma } from "~/server/db";

export function createAccounts(
  userId: string,
  plaidItemId: string,
  accounts: AccountBase[]
) {
  accounts.map(async (account) => {
    await prisma.bankAccount.create({
      data: {
        id: account.account_id,
        plaidAccountId: account.account_id,
        available: account.balances.available,
        current: account.balances.current,
        iso_currency_code: account.balances.iso_currency_code,
        limit: account.balances.limit,
        unofficial_currency_code: account.balances.unofficial_currency_code,
        mask: account.mask,
        name: account.name,
        official_name: account.official_name,
        subtype: account.subtype,
        type: account.type === "other" ? "cash" : account.type,
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: plaidItemId },
        },
      },
    });
  });
}
