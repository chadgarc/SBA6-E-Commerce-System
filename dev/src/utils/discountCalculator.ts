import { round } from "./general";
/**
 * Calculates the discount amount based on price and discount percentage.
 * @param {number} price - Original product price.
 * @param {number} discount - Discount percentage to apply.
 * @returns {number} Discount amount rounded to two decimals.
 */
export const calculateDiscount = (price: number, discount: number) => round(price * discount / 100);