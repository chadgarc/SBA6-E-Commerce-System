
export interface Product{
    id: number,
    title: string,
    price: number,
    discountPercentage: number,
    category: string,
    description?:string,
    brand?: string
}

export class Product implements Product{
    constructor(id: number, title: string, price: number, discountPercentage: number, category:string){
        this.id = id;
        this.title = title;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.category = category;
    }
}