import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type Transaction, type RemovedTransaction } from "plaid";
import { prisma } from "~/server/db";
import plaidClient from "../../plaid";
import { createAccounts } from "./queries/accounts";
import {
  retrievePlaidItemById,
  updateItemTransactionsCursor,
} from "./queries/items";
import {
  createOrUpdateTransactions,
  deleteTransactions,
} from "./queries/transactions";

async function fetchTransactionsUpdates(plaidItemId: string) {
  let added: Transaction[] = [];
  let modified: Transaction[] = [];
  let removed: RemovedTransaction[] = [];
  let hasMore = true;
  const batchSize = 100;
  const { accessToken, cursor: lastCursor } = await retrievePlaidItemById(
    plaidItemId
  );
  let cursor = lastCursor;

  try {
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor: cursor,
        count: batchSize,
      });
      const data = response.data;

      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }
  } catch (err: unknown) {
    if (err instanceof PrismaClientKnownRequestError) {
      console.error("Error:", err.message, err.cause);
    }
    console.error("Unknown Error:", err);
    cursor = lastCursor;
  }
  return {
    added,
    modified,
    removed,
    cursor,
    accessToken,
  };
}

export async function syncTransactions(userId: string, plaidItemId: string) {
  const { added, modified, removed, cursor, accessToken } =
    await fetchTransactionsUpdates(plaidItemId);

  const response = await plaidClient.accountsGet({ access_token: accessToken });

  await createAccounts(userId, plaidItemId, response.data.accounts);
  await createOrUpdateTransactions(userId, added.concat(modified));
  await deleteTransactions(userId, removed);
  await updateItemTransactionsCursor(plaidItemId, cursor);
}

export async function syncInstitutions(userId: string) {
  const institutions = await prisma.institution.findMany({
    where: {
      userId: userId,
    },
    include: {
      syncItem: true,
    },
  });

  institutions.map(async (institution) => {
    if (institution.syncItem && institution.syncItem.status !== "demo") {
      // Only sync if syncItems have not been synced within 4 hours
      if (
        institution.syncItem.updatedAt.getTime() - new Date().getTime() >=
        1000 * 60 * 60 * 4 // 4 hours
      ) {
        await syncTransactions(userId, institution.syncItem.plaidId);
        await prisma.institutionSyncItem.update({
          where: {
            plaidId: institution.syncItem.plaidId,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      }
    } else {
      console.log(`Don't update, demo: ${institution.name}`);
    }
  });
}
