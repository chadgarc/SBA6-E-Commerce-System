
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