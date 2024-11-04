export const moneyFormat: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "GBP",
};

export const formatAsGBP = (num: number) =>
  num.toLocaleString(undefined, moneyFormat);
