import { Prisma } from "@prisma/client";

export enum Round {
  DOLLAR,
  ALL,
}

export const formatToCurrency = (
  amount: Prisma.Decimal | string | undefined | null
) => {
  const USD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let formatted = amount ? USD.format(Number(amount)) : "$0";

  const value = Number(amount);

  if (amount) {
    if (value > 1000000) {
      formatted = USD.format(Math.floor(value / 100000) / 10) + "M";
    } else if (value > 1000) {
      formatted = USD.format(Math.floor(value / 100) / 10) + "K";
    }
  }

  return formatted.replace(".00", ""); //.replace(/.?0K/, /.?K/).replace("0M", "M");
};

export const formatToTitleCase = (
  str: string | undefined | null,
  capitalize_all_short = false
) => {
  if (!str) {
    return "";
  }

  if (capitalize_all_short && str.length <= 3) {
    return str.toUpperCase();
  }

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
    if (Number(divisor) === 0) {
      const result = Prisma.Decimal.div(numerator, new Prisma.Decimal(1))
        .mul(100)
        .toFixed(0);
      return `${result}%`;
    }
    const result = Prisma.Decimal.div(numerator, divisor).mul(100).toFixed(0);
    return `${result}%`;
  }
  return "0%";
};

export const formatToProgressPercentage = (
  numerator: Prisma.Decimal | undefined | null,
  divisor: Prisma.Decimal | undefined | null
) => {
  if (numerator && divisor) {
    const result = Number(Prisma.Decimal.div(numerator, divisor).mul(100));

    if (result > 100) {
      return "100%";
    }

    if (result < 0) {
      return "0%";
    }

    return `${result}%`;
  }
  return "0%";
};

export const formatToMonthYear = (date: Date) => {
  return date.toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
  });
};

export const getLastDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getLastDayOfLastMonth = () => {
  const today = new Date();
  const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
  return getLastDayOfMonth(oneMonthAgo);
};
