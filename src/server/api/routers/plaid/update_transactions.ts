import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { type Transaction, type RemovedTransaction } from "plaid";
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

  createAccounts(userId, plaidItemId, response.data.accounts);
  createOrUpdateTransactions(userId, added.concat(modified));
  deleteTransactions(userId, removed);
  await updateItemTransactionsCursor(plaidItemId, cursor);
}
