import { type Transaction, type RemovedTransaction } from "plaid";
import { prisma } from "~/server/db";

export async function deleteTransactions(
  userId: string,
  transactions: RemovedTransaction[]
) {
  const deletedTransactions = transactions.map(async (transaction) => {
    return await prisma.transaction.deleteMany({
      where: {
        id: transaction.transaction_id,
        userId: userId,
      },
    });
  });
  await Promise.all(deletedTransactions);
}

export async function createOrUpdateTransactions(
  userId: string,
  transactions: Transaction[]
) {
  const createdTransactions = transactions.map(async (transaction) => {
    return await prisma.transaction.upsert({
      where: {
        plaidId: transaction.transaction_id,
      },
      update: {
        amount: transaction.amount * -1,
        accountOwner: transaction.account_owner,
        authorizedDatetime: transaction.authorized_datetime,
        checkNumber: transaction.check_number,
        date: new Date(transaction.date),
        datetime: transaction.datetime ? new Date(transaction.datetime) : null,
        isoCurrencyCode: transaction.iso_currency_code,
        location: {
          update: {
            address: transaction.location.address,
            city: transaction.location.city,
            country: transaction.location.country,
            lat: transaction.location.lat,
            lon: transaction.location.lon,
            postalCode: transaction.location.postal_code,
            region: transaction.location.region,
            storeNumber: transaction.location.store_number,
          },
        },
        paymentMetadata: {
          update: {
            byOrderOf: transaction.payment_meta.by_order_of,
            payee: transaction.payment_meta.payee,
            payer: transaction.payment_meta.payer,
            paymentMethod: transaction.payment_meta.payment_method,
            paymentProcessor: transaction.payment_meta.payment_processor,
            ppdId: transaction.payment_meta.ppd_id,
            reason: transaction.payment_meta.reason,
            referenceNumber: transaction.payment_meta.reference_number,
          },
        },
        merchantName: transaction.merchant_name,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        isPending: transaction.pending,
        pendingTransactionId: transaction.pending_transaction_id,
        // personalFinanceCategory: String(transaction.personal_finance_category),
        personalFinanceCategoryIcon:
          transaction.personal_finance_category_icon_url,
        transactionCode: transaction.transaction_code,
        unofficialCurrencyCode: transaction.unofficial_currency_code,
      },
      create: {
        plaidId: transaction.transaction_id,
        amount: transaction.amount * -1,
        accountOwner: transaction.account_owner,
        authorizedDatetime: transaction.authorized_datetime,
        checkNumber: transaction.check_number,
        date: new Date(transaction.date),
        datetime: transaction.datetime,
        isoCurrencyCode: transaction.iso_currency_code,
        merchantName: transaction.merchant_name,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        isPending: transaction.pending,
        pendingTransactionId: transaction.pending_transaction_id,
        // personalFinanceCategory: transaction.personal_finance_category,
        personalFinanceCategoryIcon:
          transaction.personal_finance_category_icon_url,
        transactionCode: transaction.transaction_code,
        unofficialCurrencyCode: transaction.unofficial_currency_code,
        // category: {
        //   createMany: {  }
        // },
        isTransfer: false,
        location: {
          create: {
            address: transaction.location.address,
            city: transaction.location.city,
            country: transaction.location.country,
            lat: transaction.location.lat,
            lon: transaction.location.lon,
            postalCode: transaction.location.postal_code,
            region: transaction.location.region,
            storeNumber: transaction.location.store_number,
          },
        },
        paymentMetadata: {
          create: {
            byOrderOf: transaction.payment_meta.by_order_of,
            payee: transaction.payment_meta.payee,
            payer: transaction.payment_meta.payer,
            paymentMethod: transaction.payment_meta.payment_method,
            paymentProcessor: transaction.payment_meta.payment_processor,
            ppdId: transaction.payment_meta.ppd_id,
            reason: transaction.payment_meta.reason,
            referenceNumber: transaction.payment_meta.reference_number,
          },
        },
        account: {
          connect: { plaidId: transaction.account_id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  });
  await Promise.all(createdTransactions);
}
