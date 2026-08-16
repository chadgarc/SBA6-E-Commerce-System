/**
 * Rounds a number to two decimal places.
 * @param {number} number - Value to round.
 * @returns {number} Rounded value with two decimal precision.
 */
export const round = (number: number) => Math.round(number * 100) / 100;

/**
 * Capitalize text
 * @param {string} text - text to capitalize.
 * @returns {string} text capitalized.
 */
export const capitalize = (text: string) => `${text.charAt(0).toUpperCase()}${text.slice(1,)}`