import * as api from "./services/apiService"

// api.test()

const searchBar = document.getElementById('searchBar') as HTMLInputElement;
const productsTable = document.getElementById("productsTable") as HTMLTableSectionElement;

let productsList: api.ProductTemplate[] = []

const renderTable = (products: api.ProductTemplate[]) => {
    // Cleans the table
    productsTable.innerHTML = "";

    productsList = products
    console.log(productsList);
    products.forEach(product => {
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
                <button class="btn btn-outline btn-info btn-xs me-2" data-update="${product.id}">UPD</button>
                <button class="btn btn-outline btn-error btn-xs" data-delete="${product.id}">DEL</button>
            </td>
        `;

        productsTable.appendChild(productDetails);
    });
}

renderTable(await api.getInventory(0) as api.ProductTemplate[]);