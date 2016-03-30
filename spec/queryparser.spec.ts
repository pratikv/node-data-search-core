/// <reference path="../typings/tsd.d.ts" />

describe('Query Parser : ', () => {
    var parser: QueryParser;

    beforeEach(() => {
        parser = new QueryParser();
    });

    it('should be constructed clearly', () => {
        expect(parser).not.toBe(null);
    });

    describe('QueryParser.checkIfValidFindMethod', () => {
        it('should be able to identify methods starting with "findBy"', () => {
            let testStr: string = "findByName";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeTruthy();
        });

        it('shoubld NOT identify methods NOT starting with "findBy"', () => {
            let testStr: string = "doSomething";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeFalsy();
        });

        it('should be able to identity methods starting with "findTop10By"', () => {
            let testStr: string = "findTop10ByName";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeTruthy();
        });

        it('should not identify methods which does not contain a valid number in "findTop(N)By"', () => {
            let testStr: string = "findTopByName";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeFalsy();
        });

        it('should not identify method which conatains "findBy" preceded by some term', () => {
            let testStr = "dofindByName";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeFalsy();
        });


        it('shoudl identify extreme case terms like "findByfindBy"', () => {
            let testStr = "findByfindBy";
            expect(QueryParser.checkIfValidFindMethod(testStr)).toBeTruthy();

        });


    });

    describe('QueryParser.checkForBooleanQyeryInTheTerm', () => {
        it('should detect the occurance of "And" conditions in the term', () => {
            let testStr: string = "NameAndAddress";
            expect(QueryParser.checkForBooleanQyeryInTheTerm(testStr)).toBeTruthy();
        });

        it('should detect the occurance of multiple "And" conditions in the term', () => {
            let testStr: string = "NameAndAddressAndAge";
            expect(QueryParser.checkForBooleanQyeryInTheTerm(testStr)).toBeTruthy();
        });

        it('should detect the occurance of "Or" conditions in the term', () => {
            let testStr: string = "NameOrAddress";
            expect(QueryParser.checkForBooleanQyeryInTheTerm(testStr)).toBeTruthy();
        });

        it('should detect the occurance of multiple "Or" conditions in the term', () => {
            let testStr: string = "NameOrAddressOrAge";
            expect(QueryParser.checkForBooleanQyeryInTheTerm(testStr)).toBeTruthy();
        });

        it('should detect the occurance of mixture of "And" and "Or" conditions in the term', () => {
            let testStr: string = "NameAndAddressOrAge";
            expect(QueryParser.checkForBooleanQyeryInTheTerm(testStr)).toBeTruthy();
        });
    });


    describe('QueryParser.checkIfMethodInRegex', () => {
        it('should detect if the query term contains "Between" at the END ONLY', () => {
            let testStr = "ageBetween";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "Between" anywhere except the end', () => {
            let testStr = "BetweenAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });

        it('should detect if the query term contains "Equals" at the END ONLY', () => {
            let testStr = "ageEquals";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "Equals" anywhere except the end', () => {
            let testStr = "EqualsAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });

        it('should detect if the query term contains "LessThan" at the END ONLY', () => {
            let testStr = "ageLessThan";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "LessThan" anywhere except the end', () => {
            let testStr = "LessThanAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });

        it('should detect if the query term contains "GreaterThan" at the END ONLY', () => {
            let testStr = "ageGreaterThan";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "GreaterThan" anywhere except the end', () => {
            let testStr = "GreaterThanAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });

        it('should detect if the query term contains "LessThanEqualTo" at the END ONLY', () => {
            let testStr = "ageLessThanEqualTo";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "LessThanEqualTo" anywhere except the end', () => {
            let testStr = "LessThanEqualToAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });

        it('should detect if the query term contains "GreaterThanEqualTo" at the END ONLY', () => {
            let testStr = "ageGreaterThanEqualTo";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeTruthy();
        });

        it('should NOT detect if the query term contains "GreaterThanEqualTo" anywhere except the end', () => {
            let testStr = "GreaterThanEqualToAge";
            expect(QueryParser.checkIfMethodInRegex(testStr)).toBeFalsy();
        });
    });


    describe('QueryParser.splitTermByBooleanOperations', () => {

        it('should throw an error in case the term passed is "null"', () => {
            let testStr = null;
            expect(() => QueryParser.splitTermByBooleanOperations(testStr)).toThrow();
        });

        it('should throw an error in case the term passed is "undefined"', () => {
            expect(() => QueryParser.splitTermByBooleanOperations(undefined)).toThrow();
        });

        it('should return the same string in case the query term does not contain any boolean operations', () => {
            let testStr = "Name";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual([testStr]);
        });

        it('should return splits in case the "And" query term is defined as "Field1_And_Field2"', () => {
            let testStr = "NameAndAge";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["Name", "And", "Age"]);
        });

        it('should return splits in case the "Or" query term is defined as "Field1_Or_Field2"', () => {
            let testStr = "NameOrAge";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["Name", "Or", "Age"]);
        });

        it('should return splits in case the "And" query term is defined as "Field1_Condition1__And__Field2_Condition2"', () => {
            let testStr = "NameEqualsAndAgeBetween";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["NameEquals", "And", "AgeBetween"]);
        });

        it('should return splits in case the "Or" query term is defined as "Field1_Condition1__Or__Field2_Condition2"', () => {
            let testStr = "NameEqualsOrAgeBetween";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["NameEquals", "Or", "AgeBetween"]);
        });

        it('should return splits in case the "Or" query term is defined as "Field1_Or_Field2_Or_Field3"', () => {
            let testStr = "NameOrAgeOrLastname";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["Name", "Or", "Age", "Or", "Lastname"]);
        });

        it('should return splits in case the "And" query term is defined as "Field1_And_Field2_And_Field3"', () => {
            let testStr = "NameAndAgeAndLastname";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["Name", "And", "Age", "And", "Lastname"]);
        });

        it('should return splits in case the query term is defined as mix of "And" and "Or" : "Field1_And_Field2_Or_Field3"', () => {
            let testStr = "NameAndAgeOrLastname";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["Name", "And", "Age", "Or", "Lastname"]);
        });

        it('should return splits in case the query term is defined as mix of "And" and "Or" : "Field1Cond1_And_Field2Cond2_And_Field3Cond3"', () => {
            let testStr = "NameEqualsAndAgeBetweenOrLastnameEquals";
            expect(QueryParser.splitTermByBooleanOperations(testStr)).toEqual(["NameEquals", "And", "AgeBetween", "Or", "LastnameEquals"]);
        });

        it('should throw in case the term ends with "And"', () => {
            let testStr = "NameAnd";
            expect(() => QueryParser.splitTermByBooleanOperations(testStr)).toThrow();
        });

        it('should throw in case the term ends with "Or"', () => {
            let testStr = "NameOr";
            expect(() => QueryParser.splitTermByBooleanOperations(testStr)).toThrow();
        });

    });


    describe('QueryParser.splitTermTokens', () => {
        it('should throw an error in case the term passed is "null"', () => {
            let testStr = null;
            expect(() => QueryParser.splitTermTokens(testStr)).toThrow();
        });

        it('should throw an error in case the term passed is "undefined"', () => {
            expect(() => QueryParser.splitTermTokens(undefined)).toThrow();
        });

        it('should return the same string in case the query term does not contain any boolean operations', () => {
            let testStr = "Name";
            expect(QueryParser.splitTermTokens(testStr)).toEqual([testStr]);
        });

        EnumEx.getNames(Token).forEach(token => {
            it('should be able to split the query term for "' + token + '"', () => {
                let testStr = "Age" + token;
                expect(QueryParser.splitTermTokens(testStr)).toEqual(["Age", token]);
            });

            it('should throw in case the query term is just "' + token + '"', () => {
                let testStr = token;
                expect(() => QueryParser.splitTermTokens(testStr)).toThrow();
            });

            it('should return the same token in case "' + token + '" is succeeded by any other term', () => {
                let testStr = token + "To";
                expect(QueryParser.splitTermTokens(testStr)).toEqual([testStr]);
            });
        });
    });


    describe('QueryParser.splitTermByFindBy', () => {
        it('should throw an error in case the term passed is "null"', () => {
            let testStr = null;
            expect(() => QueryParser.parse(testStr)).toThrow();
        });

        it('should throw an error in case the term passed is "undefined"', () => {
            expect(() => QueryParser.parse(undefined)).toThrow();
        });

        it('should return "null" in case the term passed does not start with "findBy"', () => {
            let testStr = "checkDatabase";
            expect(QueryParser.splitTermUsingFindBy(testStr)).toBeNull();
        });

        it('should trim the query term, reducing the term by "findBy"', () => {
            let testStr = "findByName";
            expect(QueryParser.splitTermUsingFindBy(testStr)).toBe("Name");
        });

        it('should trim the query term, reducing the term by "findBy"', () => {
            let testStr = "findByName";
            expect(QueryParser.splitTermUsingFindBy(testStr)).toBe("Name");
        });

        xit('should trim the query term, reducing the term by "findTop10By"', () => {
            debugger;
            let testStr = "findTop10ByAge";
            expect(QueryParser.splitTermUsingFindBy(testStr)).toBe("Age");
        });
    });

    describe('QueryParser.parse', () => {
        it('should throw an error in case the term passed is "null"', () => {
            let testStr = null;
            expect(() => QueryParser.parse(testStr)).toThrow();
        });

        it('should throw an error in case the term passed is "undefined"', () => {
            expect(() => QueryParser.parse(undefined)).toThrow();
        });


        it('should return null in case the method does not start with "findBy"', () => {
            let testStr = "checkDatabase";
            expect(QueryParser.parse(testStr)).toBeNull();
        });

        it('should return a valid query tree ', () => {
            let testStr = "findByName";
            expect(QueryParser.parse(testStr)).not.toBeNull();
        });

        it('should have only 1 Node for "findByName"', () => {
            let testStr = "findByName";
            let res = QueryParser.parse(testStr);
            expect(res.NodeCount).toBe(1);
        });

        it('should have fieldName as "Name" for query term "findByName"', () => {
            let testStr = "findByName";
            let res = QueryParser.parse(testStr);
            expect(res.Root.fieldName).toBe("Name");
        });

        it('should have token as "Equals" for query term "findByName"', () => {
            let testStr = "findByName";
            let res = QueryParser.parse(testStr);
            expect(res.Root.token).toBe(Token.Equals);
        });

        it('should have Operation as Field for query term "findByName"', () => {
            let testStr = "findByName";
            let res = QueryParser.parse(testStr);
            expect(res.Root.op).toBe(Operation.Field);
        });

        it('should throw when passing invalid query term', () => {
            let testStr = "findByNameAndAnd";
            expect(() => QueryParser.parse(testStr)).toThrow();
        });

        EnumEx.getNames(Token).forEach(token => {
            it('should have token as "' + token + '" for "findByAge' + token + '"', () => {
                let testStr = "findByAge" + token;
                let res = QueryParser.parse(testStr);
                expect(res.Root.fieldName).toBe("Age");
                expect(res.Root.op).toBe(Operation.Field);
                expect(res.Root.token).toBe(Token[token]);
            });
        });


        it('should identify tokens correctly for the term "findByNameAndAgeBetweenAndLastname', () => {
            // Utility Methods
            let validateChildrenTobeNull = (n: IQueryTerm) => {
                expect(n.left).toBeNull();
                expect(n.right).toBeNull();
            };

            let testStr = "findByNameAndAgeBetweenAndLastname";
            let res = QueryParser.parse(testStr);
            let parent = res.Root;
            //debugger;
            expect(parent.op).toBe(Operation.And);
            expect(parent.left).not.toBeNull();

            let node = parent.left;
            expect(node.op).toBe(Operation.Field);
            expect(node.fieldName).toBe("Name");
            expect(node.token).toBe(Token.Equals);
            validateChildrenTobeNull(node);

            node = parent.right;
            expect(parent.op).toBe(Operation.And);
            expect(parent.left).not.toBeNull();
            expect(parent.right).not.toBeNull();

            parent = node;

            node = parent.left;
            expect(node.op).toBe(Operation.Field);
            expect(node.fieldName).toBe("Age");
            expect(node.token).toBe(Token.Between);
            validateChildrenTobeNull(node);

            node = parent.right;
            expect(node.op).toBe(Operation.Field);
            expect(node.fieldName).toBe("Lastname");
            expect(node.token).toBe(Token.Equals);
            validateChildrenTobeNull(node);
        });
    });
});
