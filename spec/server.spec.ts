/// <reference path="../typings/tsd.d.ts" />

describe("Query Tree :", () => {
    var tree: QueryTree;
    beforeEach(() => {
        tree = new QueryTree();
    });

    it("should not be null when created", () => {
        expect(tree).not.toBeNull();
    });

    it("should have root node null when created", () => {
        expect(tree.Root).toBeNull();
    });

    it("should have node count as 0 when created", () => {
        expect(tree.NodeCount).toBe(0);
    });

    it("should fail when the first term to be added is not a field term", () => {
        var term = new AndQueryTerm();
        expect(() => tree.addTerm(term)).toThrow("The first Term to be added to the expression tree must be a Field");
    });

    it('should add the first root node successfuly', () => {
        var term = new FieldQueryTerm(Token.Between, "someField");
        tree.addTerm(term);
        expect(tree.Root).not.toBeNull();
    });

    it("should add the second node successfully", () => {
        var term = new FieldQueryTerm(Token.Equals, "someField");
        var term2 = new AndQueryTerm();
        tree.addTerm(term);
        tree.addTerm(term2);
        expect(tree.Root.op).toBe(Operation.And);
    });

    it("should add the second node, ensuring the root node is not a Field", () => {
        var term = new FieldQueryTerm(Token.Equals, "someField");
        var term2 = new AndQueryTerm();
        tree.addTerm(term);
        tree.addTerm(term2);
        expect(tree.Root.op).not.toBe(Operation.Field);
    });

    it('should mantain the count of the number of nodes added', () => {
        var term = new FieldQueryTerm(Token.Equals, "name");
        var term2 = new AndQueryTerm();
        var term3 = new FieldQueryTerm(Token.Between, "lastName");
        tree.addTerm(term);
        tree.addTerm(term2);
        tree.addTerm(term3);
        expect(tree.NodeCount).toBe(3);
    });

    it('should throw an error when two Fields are added - at the start', () => {
        var term = new FieldQueryTerm(Token.Equals, "name");
        var term2 = new FieldQueryTerm(Token.Between, "lastName");
        tree.addTerm(term);
        expect(() => tree.addTerm(term2)).toThrow();
    });

    it('should throw an error when two Fields are added - Interim', () => {
        var term = new FieldQueryTerm(Token.Equals, "name");
        var term2 = new FieldQueryTerm(Token.Between, "lastName");
        var term3 = new FieldQueryTerm(Token.Between, "lastName");
        tree.addTerm(term);
        tree.addTerm(new AndQueryTerm());
        tree.addTerm(term2);
        expect(() => tree.addTerm(term3)).toThrow();
    });

    it('should throw an error when two NON FIELDS are added at any point', () => {
        var term = new FieldQueryTerm(Token.Equals, "name");
        var term2 = new FieldQueryTerm(Token.Between, "lastName");
        tree.addTerm(term);
        tree.addTerm(new AndQueryTerm());
        tree.addTerm(term2);
        tree.addTerm(new AndQueryTerm());
        expect(() => tree.addTerm(new OrQueryTerm())).toThrow();
    });

});

describe("Query Term : ", () => {
    it("should not be null when created", () => {
        var queryTerm = new FieldQueryTerm(Token.Equals, "someField");
        expect(queryTerm).not.toBeNull();
    });

    it("should contain the same token when created", () => {
        var queryTerm = new FieldQueryTerm(Token.Equals, "someField");
        expect(queryTerm.token).toBe(Token.Equals);
    });

    it("should contain the same fieldname when created", () => {
        var queryTerm = new FieldQueryTerm(Token.Equals, "someField");
        expect(queryTerm.fieldName).toBe("someField");
    });

    it('should return Operation as FIELD when a FieldQueryTerm is created', () => {
        var queryTerm = new FieldQueryTerm(Token.Equals, "someField");
        expect(queryTerm.op).toBe(Operation.Field);
    });

    it("should NOT contain token in case of AND query", () => {
        var queryTerm = new AndQueryTerm();
        expect(queryTerm.token).toBeUndefined();
    });

    it("should NOT contain token in case of OR query", () => {
        var queryTerm = new OrQueryTerm();
        expect(queryTerm.token).toBeUndefined();
    });

    it("should NOT contain FieldName in case of AND query", () => {
        var queryTerm = new AndQueryTerm();
        expect(queryTerm.fieldName).toBeUndefined();
    });

    it("should NOT contain FieldName in case of OR query", () => {
        var queryTerm = new OrQueryTerm();
        expect(queryTerm.fieldName).toBeUndefined();
    });


    it('should return Operation as OR when a OrQueryTerm is created', () => {
        var queryTerm = new OrQueryTerm();
        expect(queryTerm.op).toBe(Operation.Or);
    });

    it('should return Operation as AND when a AndQueryTerm is created', () => {
        var queryTerm = new AndQueryTerm();
        expect(queryTerm.op).toBe(Operation.And);
    });
});
