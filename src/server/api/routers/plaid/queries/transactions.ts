import { type Transaction, type RemovedTransaction } from "plaid";
import { prisma } from "~/server/db";

export function deleteTransactions(
  userId: string,
  transactions: RemovedTransaction[]
) {
  transactions.map(async (transaction) => {
    await prisma.transaction.deleteMany({
      where: {
        id: transaction.transaction_id,
        userId: userId,
      },
    });
  });
}

export function createOrUpdateTransactions(
  userId: string,
  transactions: Transaction[]
) {
  transactions.map(async (transaction) => {
    await prisma.transaction.upsert({
      where: {
        id: transaction.transaction_id,
      },
      update: {
        amount: transaction.amount * -1,
        account_owner: transaction.account_owner,
        authorized_datetime: transaction.authorized_datetime,
        checkNumber: transaction.check_number,
        date: new Date(transaction.date),
        datetime: transaction.datetime,
        isoCurrencyCode: transaction.iso_currency_code,
        address: transaction.location.address,
        city: transaction.location.city,
        country: transaction.location.country,
        lat: transaction.location.lat,
        lon: transaction.location.lon,
        postal_code: transaction.location.postal_code,
        region: transaction.location.region,
        store_number: transaction.location.store_number,
        merchantName: transaction.merchant_name,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        by_order_of: transaction.payment_meta.by_order_of,
        payee: transaction.payment_meta.payee,
        payer: transaction.payment_meta.payer,
        payment_method: transaction.payment_meta.payment_method,
        payment_processor: transaction.payment_meta.payment_processor,
        ppd_id: transaction.payment_meta.ppd_id,
        reason: transaction.payment_meta.reason,
        reference_number: transaction.payment_meta.reference_number,
        pending: transaction.pending,
        pendingTransactionId: transaction.pending_transaction_id,
        personalFinanceCategory: String(transaction.personal_finance_category),
        personalFinanceCategoryIcon:
          transaction.personal_finance_category_icon_url,
        transactionCode: transaction.transaction_code,
        unofficialCurrencyCode: transaction.unofficial_currency_code,
      },
      create: {
        amount: transaction.amount * -1,
        account_owner: transaction.account_owner,
        authorized_datetime: transaction.authorized_datetime,
        checkNumber: transaction.check_number,
        date: new Date(transaction.date),
        datetime: transaction.datetime,
        isoCurrencyCode: transaction.iso_currency_code,
        address: transaction.location.address,
        city: transaction.location.city,
        country: transaction.location.country,
        lat: transaction.location.lat,
        lon: transaction.location.lon,
        postal_code: transaction.location.postal_code,
        region: transaction.location.region,
        store_number: transaction.location.store_number,
        merchantName: transaction.merchant_name,
        name: transaction.name,
        paymentChannel: transaction.payment_channel,
        by_order_of: transaction.payment_meta.by_order_of,
        payee: transaction.payment_meta.payee,
        payer: transaction.payment_meta.payer,
        payment_method: transaction.payment_meta.payment_method,
        payment_processor: transaction.payment_meta.payment_processor,
        ppd_id: transaction.payment_meta.ppd_id,
        reason: transaction.payment_meta.reason,
        reference_number: transaction.payment_meta.reference_number,
        pending: transaction.pending,
        pendingTransactionId: transaction.pending_transaction_id,
        personalFinanceCategory: String(transaction.personal_finance_category),
        personalFinanceCategoryIcon:
          transaction.personal_finance_category_icon_url,
        transactionCode: transaction.transaction_code,
        unofficialCurrencyCode: transaction.unofficial_currency_code,
        // category: {
        //   createMany: {  }
        // },
        isTransfer: false,
        account: {
          connect: { id: transaction.account_id },
        },
        user: {
          connect: { id: userId },
        },
      },
    });
  });
}
