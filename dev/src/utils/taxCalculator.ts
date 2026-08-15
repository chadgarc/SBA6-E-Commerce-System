import { round } from "./general";

export const calculateTax = (price: number, category: string) => round(price * ((category === 'groceries') ? 3 : 4.75) / 100);