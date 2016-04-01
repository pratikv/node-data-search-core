
import {IQueryTree, IQueryTerm, Operation} from "./interfaces";

export class QueryTree implements IQueryTree{
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