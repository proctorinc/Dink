import {
  faCreditCard,
  faLandmark,
  faChartLine,
  faMoneyBillWave,
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
  [AccountCategory.Cash]: faMoneyBillWave,
  [AccountCategory.Credit]: faCreditCard,
  [AccountCategory.Investment]: faChartLine,
  [AccountCategory.Loan]: faLandmark,
};
