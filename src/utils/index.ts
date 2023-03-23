import { Prisma } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime";

export const formatToCurrency = (amount: Decimal | undefined | null) => {
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return amount ? USD.format(Number(amount)) : "$0.00";
};

export const formatToTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
};

export const formatToPercentage = (
  numerator: Decimal | undefined | null,
  divisor: Decimal | undefined | null
) => {
  if (numerator && divisor) {
    const result = Prisma.Decimal.div(numerator, divisor);
    console.log(result);
    return `${result?.toFixed(0)}%`;
  }
  return "0%";
};
