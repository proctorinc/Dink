import {
  type IconDefinition,
  faBank,
  faCar,
  faHouse,
  faMoneyBill1,
  faCreditCard,
  faChartLine,
  faFileInvoiceDollar,
  faMoneyBill,
  faWallet,
  faCoins,
  faSackDollar,
  faPiggyBank,
  faChartPie,
  faHandHoldingDollar,
  faMoneyBillWave,
  faEarthAmericas,
  faPlane,
  faPaperPlane,
  faLocationDot,
  faMapLocationDot,
  faFootball,
  faFutbol,
  faHeartPulse,
  faPassport,
  faSackXmark,
} from "@fortawesome/free-solid-svg-icons";

export enum AccountCategory {
  Cash = "depository",
  Credit = "credit",
  Investment = "investment",
  Loan = "loan",
}

export const accountCategories = [
  AccountCategory.Cash,
  AccountCategory.Credit,
  AccountCategory.Investment,
  AccountCategory.Loan,
];

export const AccountCategoryIcons = {
  [AccountCategory.Cash]: faMoneyBill,
  [AccountCategory.Credit]: faCreditCard,
  [AccountCategory.Investment]: faChartLine,
  [AccountCategory.Loan]: faFileInvoiceDollar,
};

export const iconMap = new Map<string, IconDefinition>(
  Object.entries({
    "dollar-bill": faMoneyBill1,
    bank: faBank,
    house: faHouse,
    car: faCar,
    "credit-card": faCreditCard,
    wallet: faWallet,
    coins: faCoins,
    "sack-dollar": faSackDollar,
    "sack-x-dollar": faSackXmark,
    "hand-dollar": faHandHoldingDollar,
    "piggy-bank": faPiggyBank,
    "chart-pie": faChartPie,
    "chart-line": faChartLine,
    "bill-wave": faMoneyBillWave,
    earth: faEarthAmericas,
    plane: faPlane,
    "paper-plane": faPaperPlane,
    "location-dot": faLocationDot,
    "map-location": faMapLocationDot,
    football: faFootball,
    soccer: faFutbol,
    "heart-pulse": faHeartPulse,
    passport: faPassport,
  })
);

export type IconColor = {
  name: string;
  primary: string;
  secondary: string;
};

export const iconColorMap = new Map<string, IconColor>(
  Object.entries({
    teal: {
      name: "teal",
      primary: "#167B8D",
      secondary: "#00C6C5",
    },
    blue: {
      name: "blue",
      primary: "#0369a1",
      secondary: "#38bdf8",
    },
    purple: {
      name: "purple",
      primary: "#434280",
      secondary: "#A3A5D7",
    },
    red: {
      name: "red",
      primary: "#961737",
      secondary: "#d18094",
    },
    orange: {
      name: "orange",
      primary: "#ea580c",
      secondary: "#fdba74",
    },
    yellow: {
      name: "yellow",
      primary: "#eab308",
      secondary: "#fef08a",
    },
  })
);
