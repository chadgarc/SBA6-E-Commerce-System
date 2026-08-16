import * as api from "./services/apiService"
import { capitalize } from "./utils/general";
import { Product } from "./models/Product";
import { validator } from "./utils/errorHandler";

// api.test()

let targetID: number = 0;
let lastID: number = 0;

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

let productsList: api.ProductTemplate[] = []
let categoryList: string[] = []

// Reset values from inputs
const defaultContent = (fields: HTMLInputElement[]) => {
    fields.forEach( field => {
        field.value = ""
    })
}

const getId = (event: Event): number => {
    const target = event.target as HTMLElement;

    const row = target.closest('tr') as HTMLTableRowElement;

    const idData = row.querySelector("[data-id]") as HTMLElement;

    return Number(idData.dataset.id);
}

const updateCategories = (categories: string[]) => {

    categories.forEach(category => {
        categoryList.push(category);

        const cat = document.createElement("li");

        cat.innerHTML = `<a data-category='${category}'>${capitalize(category)}</a>`;

        filterCategories.appendChild(cat);
    });
}

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

const addProduct = (title: string, price: number, discount: number, category: string) => {
    lastID += 1;
    createProduct(new Product(lastID , title, price, discount, category));
}

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

const deleteProduct = (id: number) => {

    productsList = productsList.filter( product => product.id !== id )

    renderTable(productsList);
}

const sortBy = async ({type = 'category', order = 'asc' }) => {
    renderTable(await api.sortProducts({ target: type, order:order, limit: 0 }))
}

const filterBy = async (type: string) => {
    if(type === 'reset'){
        renderTable(await api.getInventory(0));
    } else {
        renderTable(await api.getProductsByCategory(type))
    }
}

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

updateSave.addEventListener('click', () => {

    if(validator(updateModal, updateTitleInput, updatePriceInput, updateDiscountInput, updateCategoryInput, 'update')){
        updateProduct(targetID, updateTitleInput, updatePriceInput, updateDiscountInput, updateCategoryInput);
    }
})

addCancel.addEventListener('click', () => {
    defaultContent([addTitleInput,addPriceInput,addDiscountInput,addDiscountInput,addCategoryInput]);
    addModal.close()
})

updateCancel.addEventListener('click', () => {
    defaultContent([updateTitleInput,updatePriceInput,updateDiscountInput,updateDiscountInput,updateCategoryInput]);
    updateModal.close()
})

renderTable(await api.getInventory(0));
updateCategories(await api.getAllCategories());
lastID = productsList.length