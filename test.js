let todoApp = new todoClass(firebase);
todoApp.testmode = true;
todoApp.connect();
todoApp.load();

todoApp.promise.then(function(){
    let config = todoApp.config;
    
    describe("init", function() {
        it("init config with project id: " + config.projectId, function() {
            assert.isTrue(config.projectId !== undefined);
        });
        it("init database with project id: " + todoApp.db._databaseId.projectId, function() {
            assert.isTrue(config.projectId === todoApp.db._databaseId.projectId);
        });
        it("firebase version: " + todoApp.firebase.SDK_VERSION, function() {
            assert.isTrue(todoApp.firebase.SDK_VERSION !== undefined);
        });
        it("loaded from firebase: " + JSON.stringify(todoApp.todosData), function() {
            assert.isTrue(todoApp.todosData.length > 0);
        });
    });
    
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
    
    describe("getMaxId", function() {
        let max = 0;
        todoApp.todosData.forEach(function(item, i, arr) {
            if (+item.id > max) max = +item.id;
        });
        it("get max id for empty data: 0", function() {
            let copy = todoApp.todosData.slice();
            todoApp.todosData = [];
            assert.equal(todoApp.getMaxId(), 0);
            todoApp.todosData = copy.slice();
        });
        it("get max id for current data: " + max, function() {
            assert.equal(todoApp.getMaxId(), max);
        });
    });
    
    describe("getKeyForId", function() {
        let positions = [-1, 0, Math.round(todoApp.todosData.length * 0.5), todoApp.todosData.length - 1, todoApp.todosData.length];
        positions.forEach(function(pos, index, positions) {
            let result = false;
            let id = -1;
            let counter = 0;
            todoApp.todosData.forEach(function(item, i, arr) {
                if (counter == pos) {
                    result = i;
                    id = item.id
                }
                counter++;
            });
            it("get key for id = " + id + ", result is: " + result, function() {
                assert.equal(todoApp.getKeyForId(id), result);
            });
        })
    });
    
    describe("deleteItem", function() {
        let positions = [-1, 0, Math.round(todoApp.todosData.length * 0.5), todoApp.todosData.length - 1, todoApp.todosData.length];
        positions.forEach(function(pos, index, positions) {
            let length = todoApp.todosData.length;
            if ((pos >= 0) && (pos < todoApp.todosData.length)) length--;
            
            let position = false;
            let id = -1;
            let counter = 0;
            todoApp.todosData.forEach(function(item, i, arr) {
                if (counter == pos) {
                    position = i;
                    id = item.id
                }
                counter++;
            });
            
            it("delete item for id = " + id + " on position: " + position, function() {
                let copy = todoApp.todosData.slice();
                todoApp.deleteItem(id);
                assert((todoApp.getKeyForId(id) === false) && (todoApp.todosData.length === length));
                todoApp.todosData = copy.slice();
            });
        })
    });
    
    describe("updateState", function() {
        let positions = [0, Math.round(todoApp.todosData.length * 0.5), todoApp.todosData.length - 1];
        positions.forEach(function(pos, index, positions) {
            let position = undefined;
            let id = -1;
            let counter = 0;
            todoApp.todosData.forEach(function(item, i, arr) {
                if (counter == pos) {
                    position = i;
                    id = item.id;
                }
                counter++;
            });
            
            it("update state for id = " + id + " on position: " + position, function() {
                let copy = todoApp.todosData.slice();
                
                let result = false;
                let position = undefined;
                let counter = 0;
                todoApp.todosData.forEach(function(item, i, arr) {
                    if (counter == pos) {
                        position = i;
                        result = item.completed;
                    }
                    counter++;
                });
                
                todoApp.updateState(id);
                if ((position >= 0) && (position < todoApp.todosData.length)) {
                    assert(todoApp.todosData[position].completed === !result);
                } else {
                    assert(true);
                }
                todoApp.todosData = copy.slice();
            });
        })
    });
    
    mocha.run();
});
