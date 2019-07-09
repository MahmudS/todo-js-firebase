let todoApp = new todoClass();

describe("compareNumeric (for function sort using field id)", function() {
    describe("compare digit with digit", function() {
        let expected, a, b;
        expected = -1;
        a = {'id': 2, 'text': 'first', 'completed': true};
        b = {'id': 12, 'text': 'second', 'completed': false};
        
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
        
        expected = 1;
        a = {'id': 12, 'text': 'first', 'completed': true};
        b = {'id': 4, 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
    });
    
    describe("compare digit with string", function() {
        let expected, a, b;
        
        expected = -1;
        a = {'id': 2, 'text': 'first', 'completed': true};
        b = {'id': '12', 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
        
        expected = 1;
        a = {'id': 12, 'text': 'first', 'completed': true};
        b = {'id': '4', 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
    });
    
    describe("compare string with digit", function() {
        let expected, a, b;
        
        expected = -1;
        a = {'id': '2', 'text': 'first', 'completed': true};
        b = {'id': 12, 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
        
        expected = 1;
        a = {'id': '12', 'text': 'first', 'completed': true};
        b = {'id': 4, 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
    });
    
    describe("compare string with string", function() {
        let expected, a, b;
        
        expected = -1;
        a = {'id': '2', 'text': 'first', 'completed': true};
        b = {'id': '12', 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
        
        expected = 1;
        a = {'id': '12', 'text': 'first', 'completed': true};
        b = {'id': '4', 'text': 'second', 'completed': false};
        
        it("compare " + JSON.stringify(a) + " and " + JSON.stringify(b) + " with result: " + expected, function() {
            assert.equal(todoApp.compareNumeric(a, b), expected);
        });
    });
});
/*
describe("init", function() {
    
    it("check init", function() {
        let todosData = [];
        init();
        assert(todosData.length > 0);
    });
});
*/