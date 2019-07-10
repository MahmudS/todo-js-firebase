'use strict'

let todoClass = function(){
    let that = this;
    this.todosData = [];
    this.firebaseConfig = {};
    this.db;
    this.firebase;
    this.addText = 'addText';
    this.promise;
    
    this.getFirebaseConfig = function(){
        return {
            apiKey: "AIzaSyBw2fryKRndsw9XU_0WiYz7CNaUtQHT1Tw",
            authDomain: "test-js-90c47.firebaseapp.com",
            databaseURL: "https://test-js-90c47.firebaseio.com",
            projectId: "test-js-90c47",
            storageBucket: "",
            messagingSenderId: "663568654522",
            appId: "1:663568654522:web:f77027a05072ca18"
        };
    };
    
    this.compareNumeric = function(first, second) {
        let a = +first.id;
        let b = +second.id;
        if (a > b) return 1;
        if (a < b) return -1;
    };
    
    this.initAddButton = function(button_name){
        let addTextButton = document.getElementById(button_name);
        addTextButton.onclick = function(event) {
            let result = that.addSomeData();
            if (!result.status) {
                console.log(result.text);
            }
        }
    };
    
    this.initFirebase = function(firebase) {
        this.firebase = firebase;
    };
    
    this.initDatabase = function(){
        let config = this.getFirebaseConfig();
        this.firebase.initializeApp(config);
        this.db = this.firebase.firestore();
    };
    
    this.init = function() {
        this.todosData = [];
        this.promise = new Promise(function(resolve, reject) {
            let docRef =  that.db.collection('items').get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    that.todosData.push(doc.data());
                });
            }).then(function(){
                that.todosData.sort(that.compareNumeric);
            }).then(function(){
                resolve();
            });
        });
    };

    this.getMaxId = function() {
        let max = this.todosData.reduce(function(max, todo) {
          return (max > todo.id) ? max : todo.id;
        }, 0);
        return max;
    };
    
    this.getKeyForId = function(id) {
        let result = false;
        this.todosData.forEach(function(item, i, arr){
            if (item.id === id) result = i;
        });
        return result;
    }

    this.deleteItem = function(id) {
        let key = this.getKeyForId(id);
        if (key !== false) {
            this.todosData.splice(key, 1);
            this.db.collection('items').doc(id + '').delete();
            that.render();
        }
    };

    this.updateState = function(id) {
        let key = this.getKeyForId(id);
        if (key !== false) {
            this.todosData[key].completed = !this.todosData[key].completed;
            let sfDocRef = this.db.collection('items').doc(id + '');
            this.db.runTransaction(function(transaction) {
                return transaction.get(sfDocRef).then(function(sfDoc) {
                    if (!sfDoc.exists) {
                        throw "Document does not exist!";
                    }
                    let completed = !sfDoc.data().completed;
                    transaction.update(sfDocRef, { completed: completed });
                });
            });
            that.render();
        }
    };

    this.addSomeData = function() {
        let data = {
            id: this.getMaxId(this.todosData) + 1,
            text: document.getElementById(this.addText).value,
            completed: false
        };
        
        let result = {
            'status': true,
            'text': 'ok'
        }

        if (data.text === '') {
            result.status = false;
            result.text = 'field is empty!';
            return result;
        };

        if (this.todosData.some(function(todo){
            return todo.text === data.text;
        })) {
            result.status = false;
            result.text = 'text "' + data.text + '" already exist!';
            return result;
        };

        this.todosData.push(data);
        let setDoc = that.db.collection('items').doc(data.id + '').set(data);
        that.render();
        
        return result;
    };
    
    this.updateEventOnChange = function(){
        this.todosData.forEach(function(item, i, arr){
           let elem = document.getElementById('checkbox_id_' + item.id);
           elem.onchange = function(event) {
               that.updateState(item.id);
           };
           let span = document.getElementById('delete_item_' + item.id);
           span.onclick = function(event) {
               that.deleteItem(item.id);
           };
        });
    };
    
    this.getHtmlItem = function(item) {
        let checked = '';
        if (item.completed) {
            checked = ' checked="checked"';
        }
        return '<div class="todo-item"><input type="checkbox"' + checked + ' id="checkbox_id_' + item.id + '"><label for="checkbox_id_' + item.id + '">' + item.text + '</label><span class="deleteItem" id="delete_item_' + item.id + '">X</span></div>';
    };

    this.render = function(){
        let html = '';
        this.todosData.forEach(function(item, i, arr){
            html += that.getHtmlItem(item);
        });
        document.getElementById('todo-items').innerHTML = html;
        this.updateEventOnChange();
    };
};

