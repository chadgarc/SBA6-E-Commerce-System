import { round } from "./general";
/**
 * Calculates the tax amount for a product based on its category.
 * Groceries are taxed at 3%, all other categories at 4.75%.
 * @param {number} price - Product price before tax.
 * @param {string} category - Product category used to determine tax rate.
 * @returns {number} Tax amount rounded to two decimals.
 */
export const calculateTax = (price: number, category: string) => round(price * ((category === 'groceries') ? 3 : 4.75) / 100);