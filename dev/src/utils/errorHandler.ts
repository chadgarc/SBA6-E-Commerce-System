
/**
 * Custom error type used for general API data retrieval failures.
 */
export class DataError extends Error{

    constructor(message: string){
        super(message);
        this.name = "DataError"
    }
}

/**
 * Custom error type used when an invalid or non‑existent ID is requested.
 */
export class IdError extends Error{

    constructor(message: string){
        super(message);
        this.name = "IdError"
    }
}

/**
 * Centralized error handler that logs custom and generic errors.
 * @param {Error} error - Error instance to process.
 */
export const errorHandler = (error: Error) => {
    if(error instanceof DataError){
        console.error("Data Error:", error.message);
    } else if( error instanceof IdError){
        console.error("Id Error:", error.message);
    } else{
        console.error(error);
    }
}

/**
 * Validates product form fields inside a modal container.
 *
 * Works for both ADD and UPDATE modals by using a dynamic prefix
 * (e.g., "add-title-error" or "update-title-error").
 *
 * @param {HTMLElement} row - The modal element containing the form and error spans.
 * @param {HTMLInputElement} title - Input field for the product title.
 * @param {HTMLInputElement} price - Input field for the product price. Must be numeric.
 * @param {HTMLInputElement} discountPercentage - Input field for the discount percentage. Must be numeric.
 * @param {HTMLInputElement} category - Input field for the product category.
 * @param {string} prefix - Prefix used for error span IDs ("add" or "update").
 * @returns {boolean} Returns `true` if all fields are valid, otherwise `false`.
 */
export const validator = (
    row: HTMLElement,
    title: HTMLInputElement,
    price: HTMLInputElement,
    discountPercentage: HTMLInputElement,
    category: HTMLInputElement,
    prefix: string
    ): boolean => {

    let isValid = true;

    const showError = (field: string) => {
        const span = row.querySelector(`#${prefix}-${field}-error`) as HTMLElement;
        if (span) span.classList.remove("hidden");
    };

    const hideError = (field: string) => {
        const span = row.querySelector(`#${prefix}-${field}-error`) as HTMLElement;
        if (span) span.classList.add("hidden");
    };

    // TITLE
    if (title.value.trim() === "") {
        showError("title");
        isValid = false;
    } else {
        hideError("title");
    }

    // PRICE
    if (price.value.trim() === "" || isNaN(Number(price.value))) {
        showError("price");
        isValid = false;
    } else {
        hideError("price");
    }

    // DISCOUNT
    if (discountPercentage.value.trim() === "" || isNaN(Number(discountPercentage.value))) {
        showError("discount");
        isValid = false;
    } else {
        hideError("discount");
    }

    // CATEGORY
    if (category.value.trim() === "") {
        showError("category");
        isValid = false;
    } else {
        hideError("category");
    }

    return isValid;
};
