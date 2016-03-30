"use strict";

enum Operation {
    Field,
    And,
    Or
}

enum Token {
    Equals,
    Between,
    StartsWith,
    EndsWith,
    LessThan,
    GreaterThan,
    LessThanEqualTo,
    GreaterThanEqualTo
}

interface IQueryTerm {
    op: Operation;
    token: Token;
    fieldName: string;
    parent: IQueryTerm;
    left: IQueryTerm;
    right: IQueryTerm;
}

class BaseQueryTerm implements IQueryTerm {
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

class FieldQueryTerm extends BaseQueryTerm {
    constructor(token: Token, fieldName: string) {
        super(Operation.Field, token, fieldName);
    }
}

class AndQueryTerm extends BaseQueryTerm {
    constructor() {
        super(Operation.And);
    }
}

class OrQueryTerm extends BaseQueryTerm {
    constructor() {
        super(Operation.Or);
    }
}


class QueryTree {
    private root: IQueryTerm;

    private count: number;
    public get NodeCount(): number {
        return this.count;
    }

    constructor() {
        this.root = null;
        this.count = 0;
    }
    public get Root(): IQueryTerm {
        return this.root;
    }

    addTerm(term: IQueryTerm) {
        if (!term) {
            return;
        }
        if (!this.root) {
            if (term.op !== Operation.Field) {
                throw "The first Term to be added to the expression tree must be a Field";
            }
            this.root = term;
        }
        else {
            // check if the root is a Field
            // This generally happens when the second node is added
            if (this.root.op === Operation.Field) {
                // In case the term being addded is a Field, it is a violation.
                if (term.op === Operation.Field) {
                    throw "Invalid Operation. A Field cannot be added again without an operation"
                } else {
                    let temp = this.root;
                    temp.parent = term;
                    term.left = temp;
                    this.root = term;
                }
            } else {
                // take a temp;
                let prev = this.root;
                while (prev.right && prev.right.op !== Operation.Field) {
                    prev = prev.right;
                }
                if (prev.right) {
                    if (term.op === Operation.Field) {
                        throw "Invalid Operation. A Field cannot be added continuously";
                    }
                    let temp = prev.right;
                    prev.right = term;
                    term.parent = prev;
                    temp.parent = term;
                    term.left = temp;
                } else {
                    if (term.op !== Operation.Field) {
                        throw "Invalid Operation. Non Field tokens cannot be added continuously";
                    }
                    prev.right = term;
                    term.parent = prev;
                }
            }
        }
        this.count++;
    }
}

class EnumEx {
    static getNames(e: any) {
        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static getValues(e: any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues(e: any) {
        return EnumEx.getValues(e).map(v => { return { name: e[v] as string, value: v }; });
    }
}

class QueryParser {

    static findByRegex = /^find(Top[0-9]+)?By/;
    static regexForAndOr = /(And|Or)/;
    static regexForTokens = null;

    static tokenMap: Map<string, Number>;

    static checkForBooleanQyeryInTheTerm(term: string) {
        return QueryParser.regexForAndOr.test(term);
    }

    static checkIfMethodInRegex(term: string) {
        return QueryParser.regexForTokens.test(term);
    }

    static checkIfValidFindMethod(str: string) {
        return QueryParser.findByRegex.test(str);
    }

    static splitTermUsingFindBy(term: string): string {
        if (!term) {
            throw "Invalid term. Term cannot be null or empty";
        }
        if (!this.checkIfValidFindMethod(term)) {
            return null;
        }

        let splits = term.split(QueryParser.findByRegex);
        splits = splits.filter(s => s !== undefined && s !== "");

        if (splits.length !== 1) {
            throw "Invalid term : " + term;
        }

        return splits[0];
    }

    static splitTermTokens(term: string): string[] {
        if (!term) {
            throw "Invalid term. Term cannot be null or empty";
        }

        if (!this.checkIfMethodInRegex(term)) {
            return [term];
        }

        let splits = term.split(QueryParser.regexForTokens);

        splits = splits.filter(s => s !== "");

        if (splits.length !== 2) {
            throw "Invalid term : " + term;
        }

        return splits;
    }

    static splitTermByBooleanOperations(term: string): string[] {
        if (!term) {
            throw "Invalid term. Term cannot be null or empty";
        }

        if (!this.checkForBooleanQyeryInTheTerm(term)) {
            return [term];
        }

        let splits = term.split(QueryParser.regexForAndOr);

        // Validate the splits. In case the count of the terms is even, there is an error;
        // e.g.
        // PASS:     NameAndAge  ====> Splits : "Name",  "And",   "Age"
        // PASS:     NameOrAge   ====> Splits : "Name",  "Or",    "Age"
        // FAIL:     NameOr      ====> Splits : "Name",  "Or"

        splits = splits.filter(s => s !== ""); // The splits returns "" for the last element for some cases

        if (splits.length % 2 === 0) {
            throw "Invalid query term : " + term;
        }
        return splits;
    }

    static parse(term: string): QueryTree {
        if (!term) {
            throw "Invalid term. Term cannot be null or empty";
        }

        let str = this.splitTermUsingFindBy(term);
        if (str === null) {
            return null;
        }
        let tree = new QueryTree();
        var booleanSplits = this.splitTermByBooleanOperations(str);
        booleanSplits.forEach(split => {
            if (split === "And") {
                tree.addTerm(new AndQueryTerm());
            }
            else if (split === "Or") {
                tree.addTerm(new OrQueryTerm());
            }
            else {
                var tokenSplits = this.splitTermTokens(split);
                let token = tokenSplits.length === 2 ? tokenSplits[1] : "Equals";
                tree.addTerm(new FieldQueryTerm(Token[token], tokenSplits[0]));
            }
        });
        return tree;
    }
}

interface IQueryParserResult {

}

(function initQueryParserStaticRegex() {
    QueryParser.tokenMap = new Map<string, Number>();
    var tokenList = EnumEx.getNames(Token);
    tokenList.forEach(t => {
        QueryParser.tokenMap.set(t, Token[t]);
    });
    QueryParser.regexForTokens = new RegExp("(" + tokenList.join("|") + ")$");
})();
