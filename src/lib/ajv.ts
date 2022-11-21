import Ajv, { ValidateFunction } from "ajv";

class AJValidator{
    private ajv: Ajv;
    constructor(){
        this.ajv = new Ajv();
    }
    public validate(schema: object, data: object): boolean{
        const validate: ValidateFunction = this.ajv.compile(schema);
        return validate(data);
    }
}