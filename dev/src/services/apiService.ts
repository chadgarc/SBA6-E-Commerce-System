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

/**
 * Shape of a product object used for adding or update methods
 * All fields are optional to allow partial attributed.
 */

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

/**
 * Retrieves a list of products from the API.
 * @param {number} limit - Maximum number of products to fetch.
 * @returns {Promise<Product[]>} A list of Product instances.
 */

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

/**
 * Retrieves all available product categories from the API.
 * @returns {Promise<string[]>} A list of category names.
 */
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

/**
 * Retrieves all products from a specific category.
 * @param {string} category - Category name to filter products.
 * @returns {Promise<Product[]>} A list of Product instances.
 */
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

/**
 * Retrieves products sorted by a specific field and order.
 * @param {Object} options - Sorting configuration.
 * @param {string} options.target - Field to sort by (e.g., title, price, category).
 * @param {string} options.order - Sorting order ('asc' or 'desc').
 * @param {number} options.limit - Maximum number of products to fetch.
 * @returns {Promise<Product[]>} A sorted list of Product instances.
 */
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

/**
 * Searches for products matching a given query string.
 * @param {string} target - Search term to match product fields.
 * @returns {Promise<Product[]>} A list of matching Product instances.
 */
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

/**
 * Retrieves the total number of products available in the API.
 * @returns {Promise<number>} Total product count.
 */
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

/**
 * Retrieves a single product by its unique ID.
 * @param {number} id - Product ID to search for.
 * @returns {Promise<Product>} The matching Product instance.
 */
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

/**
 * Sends a new product to the API for creation. It will always add id:195
 * @param {ProductTemplate} product - Product data to create.
 * @returns {Promise<Object>} The created product returned by the API.
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

/**
 * Updates an existing product using its ID.
 * @param {number} id - ID of the product to update.
 * @param {ProductTemplate} product - Fields to update.
 * @returns {Promise<Object>} The updated product returned by the API.
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

/**
 * Deletes a product from the API using its ID.
 * @param {number} id - ID of the product to delete.
 * @returns {Promise<Object>} The deleted product response from the API.
 */
export const deleteProduct = async (id:number) => {

    try{

        const response = await fetch(`${PRODUCTS.URL}/${id}`, { method: 'DELETE' });
    
        return await response.json();

    } catch(error: unknown){
        errorHandler(error as Error)
    };
}

// Testing all methods
export const test = async () => {

    console.log(await getProductsByCategory('laptops'))

    console.log(await getInventory())

    console.log(await getProductById(20))
    
    console.log(await getInventoryQty())
    
    console.log(await searchProduct("laptop"))
    
    console.log(await sortProducts({ limit: 0 }))
    
    console.log(await getAllCategories())

    console.log(await addProduct({ title: 'BMW Pencil', price: 5.6, discountPercentage: 10, category: 'school' }));

    console.log(await addProduct({ title: 'ASUS TUF F15', price: 980, discountPercentage: 15, category: 'laptop' }));

    console.log(await updateProduct(194,{title: "iPhone 16", price: 900, discountPercentage: 0, brand: "Apple"}));

    console.log(await deleteProduct(3));

}