import { Prisma } from "@prisma/client";

export const formatToCurrency = (amount: Prisma.Decimal | undefined | null) => {
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
  numerator: Prisma.Decimal | undefined | null,
  divisor: Prisma.Decimal | undefined | null
) => {
  if (numerator && divisor) {
    const result = Prisma.Decimal.div(numerator, divisor).mul(100).toFixed(0);
    return `${result}%`;
  }
  return "0%";
};
