
export class DataError extends Error{

    constructor(message: string){
        super(message);
        this.name = "DataError"
    }
}

export class IdError extends Error{

    constructor(message: string){
        super(message);
        this.name = "IdError"
    }
}

export const errorHandler = (error: Error) => {
    if(error instanceof DataError){
        console.error("Data Error:", error.message);
    } else if( error instanceof IdError){
        console.error("Id Error:", error.message);
    } else{
        console.error(error);
    }
}