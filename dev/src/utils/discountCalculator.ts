import { round } from "./general";

export const calculateDiscount = (price: number, discount: number) => round(price * discount / 100);