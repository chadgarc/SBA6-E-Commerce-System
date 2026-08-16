import { DataError, IdError, errorHandler } from "../utils/errorHandler";
import { Product, type ProductData, type Review} from "../models/Product";

enum PRODUCTS{
    URL = 'https://dummyjson.com/products',
}

enum ERROR{
    ID = "ID doesn't exist",
    GET = "Unable to retrieve data",
    ADD = "Unable to update data",
    SEARCH = "No matching products"
}

export interface ProductTemplate{
    id?: number,
    title?: string,
    price?: number,
    discountPercentage?: number,
    category?: string,
    description?:string | undefined,
    brand?: string,
    reviews?: Review[],
}

/**
 *
 * THIS SECTION RETRIEVES DATA FROM API
 *
 * */

export const getInventory = async (limit: number = 30) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}?limit=${limit}`);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        const data = await response.json();

        const inventory: ProductData[] = data.products.map((product: ProductData) => {
            return new Product(
                product.id,
                product.title,
                product.price,
                product.discountPercentage,
                product.category
            );
        })

        return inventory;
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const getAllCategories = async () => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/category-list`);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        return response.json();
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const getProductsByCategory = async (category: string) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/category/${category}`);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        const data = await response.json();

        const inventory: ProductData[] = data.products.map((product: ProductData) => {
            return new Product(
                product.id,
                product.title,
                product.price,
                product.discountPercentage,
                product.category
            );
        })

        return inventory;
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

// asc or desc
export const sortProducts = async ( { target = 'title', order = 'asc', limit = 30 }) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}?sortBy=${target}&order=${order}&limit=${limit}`);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        const data = await response.json();

        const inventory: ProductData[] = data.products.map((product: ProductData) => {
            return new Product(
                product.id,
                product.title,
                product.price,
                product.discountPercentage,
                product.category
            );
        })

        return inventory;
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const searchProduct = async (target: string) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/search?q=${target}`);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        const data = await response.json();

        const inventory: ProductData[] = data.products.map((product: ProductData) => {
            return new Product(
                product.id,
                product.title,
                product.price,
                product.discountPercentage,
                product.category
            );
        })

        return inventory;
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const getInventoryQty = async () => {

    try{
        const response = await fetch(PRODUCTS.URL);

        if(!response.ok){
            throw new DataError(ERROR.GET);
        }

        const data = await response.json();

        return data.total;
    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const getProductById = async (id: number) => {

    try{

        const response = await fetch(`${PRODUCTS.URL}/${id}`);

        if(!response.ok){
            throw new IdError(ERROR.ID);
        }

        const data = await response.json();

        const product: ProductData = new Product(
            data.id,
            data.title,
            data.price,
            data.discountPercentage,
            data.category
        );

        return product;

    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

/**
 *
 * This Section adds products
 *
 */

export const addProduct = async (product:ProductTemplate) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/add`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })

        if(!response.ok){
            throw new DataError(ERROR.ADD);
        }

        return await response.json();

    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

/**
 *
 * This Section updates products
 *
 */

export const updateProduct = async (id:number, product:ProductTemplate) => {
    
    try{
        const response = await fetch(`${PRODUCTS.URL}/${id}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        })

        if(!response.ok){
            throw new IdError(ERROR.ID);
        }

        return await response.json();

    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

export const deleteProduct = async (id:number) => {

    try{

        const response = await fetch(`${PRODUCTS.URL}/${id}`, { method: 'DELETE' });
    
        return await response.json();

    } catch(error: unknown){
        errorHandler(error as Error)
    };
}