export enum Operation {
    Field,
    And,
    Or
}

export enum Token {
    Equals,
    Between,
    StartsWith,
    EndsWith,
    LessThan,
    GreaterThan,
    LessThanEqualTo,
    GreaterThanEqualTo
}

export interface IQueryTerm {
    op: Operation;
    token: Token;
    fieldName: string;
    parent: IQueryTerm;
    left: IQueryTerm;
    right: IQueryTerm;
}

export interface IQueryTree{
    Root : IQueryTerm;
    NodeCount : Number;
}