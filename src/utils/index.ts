import type { Decimal } from "@prisma/client/runtime";

export const formatToCurrency = (amount: Decimal | null) => {
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return amount ? USD.format(Number(amount)) : "$0.00";
};
