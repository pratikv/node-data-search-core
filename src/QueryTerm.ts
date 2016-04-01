
import {IQueryTerm, Operation, Token} from "./interfaces";

export class BaseQueryTerm implements IQueryTerm {
    op: Operation;
    token: Token;
    fieldName: string;
    parent: IQueryTerm;
    left: IQueryTerm;
    right: IQueryTerm;

    constructor(op: Operation, token?: Token, fieldName?: string) {
        this.op = op;
        this.token = token;
        this.fieldName = fieldName;
        this.parent = null;
        this.left = null;
        this.right = null;
    }
}

export class FieldQueryTerm extends BaseQueryTerm {
    constructor(token: Token, fieldName: string) {
        super(Operation.Field, token, fieldName);
    }
}

export class AndQueryTerm extends BaseQueryTerm {
    constructor() {
        super(Operation.And);
    }
}

export class OrQueryTerm extends BaseQueryTerm {
    constructor() {
        super(Operation.Or);
    }
}

