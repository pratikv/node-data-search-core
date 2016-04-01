"use strict";

import {IQueryTree, Token} from  "./interfaces";
import {FieldQueryTerm, AndQueryTerm, OrQueryTerm} from "./QueryTerm";
import {QueryTree} from "./QueryTree";
import {EnumEx} from "./helper";

export class QueryParser {

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

    static parse(term: string): IQueryTree {
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
