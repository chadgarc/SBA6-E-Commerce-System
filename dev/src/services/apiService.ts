import { DataError, IdError } from "../utils/errorHandler";
import { Product, type ProductData } from "../models/Product";

enum PRODUCTS{
    URL = 'https://dummyjson.com/products'
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
            throw new DataError("Unable to retrieve data");
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
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}

export const getAllCategories = async () => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/category-list`);

        if(!response.ok){
            throw new DataError("Unable to retrieve data");
        }

        return response.json();
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}

export const getProductsByCategory = async (category: string) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/category/${category}`);

        if(!response.ok){
            throw new DataError("Unable to retrieve data");
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
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}

// asc or desc
export const sortProducts = async ( { target = 'title', order = 'asc', limit = 30 }) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}?sortBy=${target}&order=${order}&limit=${limit}`);

        if(!response.ok){
            throw new DataError("Unable to retrieve data");
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
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}

export const searchProduct = async (target: string) => {

    try{
        const response = await fetch(`${PRODUCTS.URL}/search?q=${target}`);

        if(!response.ok){
            throw new DataError("Unable to retrieve Data");
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
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Not found:", error.message);
        } else{
            console.error(error);
        }
    }
}

export const getInventoryQty = async () => {

    try{
        const response = await fetch(PRODUCTS.URL);

        if(!response.ok){
            throw new DataError("Unable to retrieve data");
        }

        const data = await response.json();

        return data.total;
    }
    catch(error){
        if(error instanceof DataError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}

export const getProductById = async (id: number) => {

    try{

        const response = await fetch(`${PRODUCTS.URL}/${id}`);

        if(!response.ok){
            throw new IdError("ID doesn't exist");
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

    } catch(error){
        if( error instanceof IdError){
            console.error("Data Error:", error.message);
        } else{
            console.error(error);
        }
    }
}