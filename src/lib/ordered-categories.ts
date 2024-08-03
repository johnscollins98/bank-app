import { SPENDING_CATEGORIES, Transactions } from "./starling-types";

export const orderCategoriesByPopularity = (
  feedItems: Transactions["feedItems"],
) => {
  return SPENDING_CATEGORIES.toSorted((a, b) => {
    const popularity = feedItems.reduce((final, feedItem) => {
      if (feedItem.spendingCategory === a) return final - 1;
      if (feedItem.spendingCategory === b) return final + 1;
      return final;
    }, 0);

    // put most popular at the top
    if (popularity !== 0) return popularity;

    // then sort by alphabet
    return a.localeCompare(b);
  });
};
