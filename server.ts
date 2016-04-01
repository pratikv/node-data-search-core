"use strict";

import {QueryParser} from "./src/QueryParser";
import {IQueryTree} from "./src/interfaces";
export {IQueryTerm,IQueryTree,Operation,Token} from "./src/interfaces";

export function Parse(term : string) : IQueryTree{
    return QueryParser.parse(term);
};