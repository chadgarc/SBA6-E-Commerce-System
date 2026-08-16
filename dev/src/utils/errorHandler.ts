
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