export const moneyFormat: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "GBP",
  signDisplay: "never",
};

export const formatAsGBP = (
  num: number,
  showPositiveSign = true,
  showNegativeSign = false,
) =>
  `${num === 0 ? "" : num > 0 ? (showPositiveSign ? "+" : "") : showNegativeSign ? "-" : ""}${num.toLocaleString(undefined, moneyFormat)}`;
