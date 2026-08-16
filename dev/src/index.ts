import * as api from "./services/apiService"
import { capitalize } from "./utils/general";
import { Product } from "./models/Product";
import { validator } from "./utils/errorHandler";

/**
 * Inventory Management Frontend
 * ------------------------------
 * This module handles all client-side logic for the product inventory system:
 * - Rendering products in a dynamic HTML table
 * - Searching by text or numeric ID
 * - Filtering by category
 * - Sorting using API-provided endpoints
 * - Creating, editing, and deleting products locally
 * - Managing modal dialogs for add/update operations
 * - Synchronizing displayed data with the DummyJSON API
 *
 * The inventory displayed in the table is stored locally in `productsList`.
 * API calls are used only for fetching, searching, sorting, and filtering.
 */

/**
 * Stores the ID of the product currently selected for editing.
 */
let targetID: number = 0;

/**
 * Tracks the last assigned ID for locally created products.
 * Incremented each time a new product is added.
 */
let lastID: number = 0;

/**
 * Local list of products currently rendered in the table.
 * Updated on every add, update, delete, or table re-render.
 */
let productsList: api.ProductTemplate[] = []

/**
 * List of category names retrieved from the API.
 */
let categoryList: string[] = []

const searchBar = document.getElementById('searchBar') as HTMLInputElement;
const filterCategories = document.getElementById('filterCategories') as HTMLUListElement;
const productsTable = document.getElementById("productsTable") as HTMLTableSectionElement;

const addTitleInput = document.getElementById('add-title') as HTMLInputElement;
const addPriceInput = document.getElementById("add-price") as HTMLInputElement;
const addDiscountInput = document.getElementById("add-discount") as HTMLInputElement;
const addCategoryInput = document.getElementById('add-category') as HTMLInputElement;
const addSave = document.getElementById('addSave') as HTMLButtonElement;

const updateTitleInput = document.getElementById('update-title') as HTMLInputElement;
const updatePriceInput = document.getElementById("update-price") as HTMLInputElement;
const updateDiscountInput = document.getElementById("update-discount") as HTMLInputElement;
const updateCategoryInput = document.getElementById('update-category') as HTMLInputElement;
const updateSave = document.getElementById('updateSave') as HTMLButtonElement;

const addModal = document.getElementById("addModal") as HTMLDialogElement
const addCancel = document.getElementById('addCancel') as HTMLButtonElement;
const updateModal = document.getElementById("updateModal") as HTMLDialogElement;
const updateCancel = document.getElementById('updateCancel') as HTMLButtonElement;

const sortByBtn = document.getElementById('sortByList') as HTMLUListElement;

/**
 * Clears the value of multiple input fields.
 * @param fields - Array of HTMLInputElements to reset.
 */
const defaultContent = (fields: HTMLInputElement[]) => {
    fields.forEach( field => {
        field.value = ""
    })
}

/**
 * Extracts the product ID from a click event inside the table.
 * Finds the closest <tr> and reads its data-id attribute.
 * @param event - Click event originating from the table.
 * @returns The numeric ID of the clicked product.
 */
const getId = (event: Event): number => {
    const target = event.target as HTMLElement;

    const row = target.closest('tr') as HTMLTableRowElement;

    const idData = row.querySelector("[data-id]") as HTMLElement;

    return Number(idData.dataset.id);
}

/**
 * Renders category filters in the sidebar.
 * Each category becomes a clickable <li> element.
 * @param categories - List of category names from the API.
 */
const updateCategories = (categories: string[]) => {

    categories.forEach(category => {
        categoryList.push(category);

        const cat = document.createElement("li");

        cat.innerHTML = `<a data-category='${category}'>${capitalize(category)}</a>`;

        filterCategories.appendChild(cat);
    });
}

/**
 * Creates a <tr> element representing a product and appends it to the table.
 * Also pushes the product into the local productsList array.
 *
 * @param product - ProductTemplate containing product data.
 */
const createProduct = (product: api.ProductTemplate) => {
    // Create table row element
    const productDetails = document.createElement('tr');

    // I'll find the id with const id = row.dataset.id;
    // I'll update or delete an element with const id = button.dataset.delete;
    productDetails.innerHTML = `
        <td class='text-right' data-id="${product.id}">${product.id}</td>
        <td class="md:w-100">${product.title}</td>
        <td class='whitespace-pre text-right'>$\t${product.price}</td>
        <td class='text-center'>${product.category}</td>
        <td class='text-right'>${product.discountPercentage}%</td>
        <td>
            <button class="btn btn-outline btn-info btn-xs me-2" onclick="updateModal.showModal()" data-update="${product.id}">UPD</button>
            <button class="btn btn-outline btn-error btn-xs" data-delete="${product.id}">DEL</button>
        </td>
    `;

    // It won't update the server, but for adding purposes it will show the products to the list
    productsList.push(product);
    productsTable.appendChild(productDetails);
}

/**
 * Re-renders the entire product table.
 * Clears existing rows and rebuilds them using createProduct().
 *
 * @param products - Array of products to display.
 */
const renderTable = (products: api.ProductTemplate[]) => {
    // Cleans the table
    productsTable.innerHTML = "";
    
    productsList = []

    if(products.length > 0){
        products.forEach(product => {
            createProduct(product);
        });
    }
}

/**
 * Adds a new product locally (not sent to the API).
 * Generates a new incremental ID using lastID.
 *
 * @param title - Product title.
 * @param price - Product price.
 * @param discount - Discount percentage.
 * @param category - Product category.
 */
const addProduct = (title: string, price: number, discount: number, category: string) => {
    lastID += 1;
    createProduct(new Product(lastID , title, price, discount, category));
}

/**
 * Updates an existing product inside productsList.
 * After updating, the table is fully re-rendered.
 *
 * @param id - ID of the product to update.
 * @param titleInput - Input element containing the new title.
 * @param priceInput - Input element containing the new price.
 * @param discountInput - Input element containing the new discount.
 * @param categoryInput - Input element containing the new category.
 */
const updateProduct = (id: number, titleInput: HTMLInputElement, priceInput: HTMLInputElement, discountInput: HTMLInputElement, categoryInput: HTMLInputElement) => {

    const product = productsList.find( product => product.id === id)

    if(!product) return;

    product.title = titleInput.value.trim();
    product.price = Number(priceInput.value.trim());
    product.discountPercentage = Number(discountInput.value.trim());
    product.category = categoryInput.value.trim();

    defaultContent([titleInput, priceInput, discountInput, categoryInput])
    renderTable(productsList);
    updateModal.close()
}

/**
 * Removes a product from productsList by ID.
 * Re-renders the table after deletion.
 *
 * @param id - ID of the product to delete.
 */
const deleteProduct = (id: number) => {

    productsList = productsList.filter( product => product.id !== id )

    renderTable(productsList);
}

/**
 * Sorts products using the API's sorting endpoint.
 * @param options - Object containing sort field and order.
 */
const sortBy = async ({type = 'category', order = 'asc' }) => {
    renderTable(await api.sortProducts({ target: type, order:order, limit: 0 }))
}

/**
 * Filters products by category using the API.
 * If type === 'reset', reloads the full inventory.
 *
 * @param type - Category name or 'reset'.
 */
const filterBy = async (type: string) => {
    if(type === 'reset'){
        renderTable(await api.getInventory(0));
    } else {
        renderTable(await api.getProductsByCategory(type))
    }
}

/**
 * Handles search input changes.
 * - If the search bar is empty, reloads the full inventory.
 * - Otherwise performs a text/ID search using api.searchProduct().
 */
searchBar.addEventListener('input', async () => {
    const query = searchBar.value.trim().toLowerCase();

    if(query === '') {
        renderTable(await api.getInventory(0))
    } else{
        renderTable(await api.searchProduct(query))
    }
    
})

sortByBtn.addEventListener('click', async event => {
    const target = event.target as HTMLElement;

    if(!target.dataset.sort) return;

    await sortBy(JSON.parse(target.dataset.sort));
})

filterCategories.addEventListener('click', async event => {
    const target = event.target as HTMLElement;

    if (!target.dataset.category) return;

    filterBy(target.dataset.category);
})

addSave.addEventListener('click', () => {
    if(validator(addModal, addTitleInput, addPriceInput, addDiscountInput, addCategoryInput, 'add')){
        addProduct(addTitleInput.value, Number(addPriceInput.value), Number(addDiscountInput.value), addCategoryInput.value)
        defaultContent([addTitleInput,addPriceInput,addDiscountInput,addDiscountInput,addCategoryInput]);
        addModal.close()
    }
})

/**
 * Main click handler for the product table.
 * Uses event delegation to detect UPD and DEL buttons.
 *
 * - UPD: Loads product data into the update modal.
 * - DEL: Deletes the selected product.
 */
productsTable.addEventListener('click', event =>{
    
    const id = getId(event);
    
    const target = event.target as HTMLElement;

    if(target.dataset.update){
        targetID = id;

        const product = productsList.find( product => product.id === id)

        if(!product) return;

        updateTitleInput.value = product.title || "";
        updatePriceInput.value = `${product.price}` || "";
        updateDiscountInput.value = `${product.discountPercentage}` || "";
        updateCategoryInput.value = product.category || "";

    } else if (target.dataset.delete){
        deleteProduct(id)
    }
})

/**
 * Validates update modal inputs and applies changes
 * to the product currently stored in targetID.
 */
updateSave.addEventListener('click', () => {

    if(validator(updateModal, updateTitleInput, updatePriceInput, updateDiscountInput, updateCategoryInput, 'update')){
        updateProduct(targetID, updateTitleInput, updatePriceInput, updateDiscountInput, updateCategoryInput);
    }
})

/**
 * Clears inputs and closes the Add Product modal.
 */
addCancel.addEventListener('click', () => {
    defaultContent([addTitleInput,addPriceInput,addDiscountInput,addDiscountInput,addCategoryInput]);
    addModal.close()
})

/**
 * Clears inputs and closes the Update Product modal.
 */
updateCancel.addEventListener('click', () => {
    defaultContent([updateTitleInput,updatePriceInput,updateDiscountInput,updateDiscountInput,updateCategoryInput]);
    updateModal.close()
})

/**
 * Initial setup:
 * - Loads full inventory from the API
 * - Renders products in the table
 * - Loads and displays categories
 * - Sets lastID based on the number of loaded products
 */
renderTable(await api.getInventory(0));
updateCategories(await api.getAllCategories());
lastID = productsList.length

// api.test()