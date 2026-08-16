import { calculateDiscount } from "../utils/discountCalculator";

export interface Review {
        rating: number,
        comment: string,
        date: string,
        reviewerName: string,
        reviewerEmail: string
}
export interface ProductData{
    id: number,
    title: string,
    price: number,
    discountPercentage: number,
    category: string,
    description?:string | undefined,
    brand?: string,
    reviews?: Review[],
}

/**
 * Represents a product entity retrieved from the API.
 * Stores product information such as id, title, price,
 * discount percentage and category.
 */
export class Product implements ProductData{
    id: number;
    title: string;
    price: number;
    discountPercentage: number;
    category: string;
    description?: string;
    brand?: string;
    reviews?: Review[];

    constructor(id: number, title: string, price: number, discountPercentage: number, category:string){
        this.id = id;
        this.title = title;
        this.price = price || 0;
        this.discountPercentage = discountPercentage || 0;
        this.category = category;
    }

    getPriceWithDiscount(){
        return this.price - calculateDiscount(this.price, this.discountPercentage);
    }

    displayDetails(){
        return `Title: ${this.title}\nPrice: $${this.price}\nDiscount Percentage: ${this.discountPercentage}%\nCategory: ${this.category}`;
    }
}