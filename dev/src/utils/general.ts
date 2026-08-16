/**
 * Rounds a number to two decimal places.
 * @param {number} number - Value to round.
 * @returns {number} Rounded value with two decimal precision.
 */
export const round = (number: number) => Math.round(number * 100) / 100;