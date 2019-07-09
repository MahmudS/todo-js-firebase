'use strict'

let todoClass = function(){
    let that = this;
    this.block_multiclick = false;
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
            that.addSomeData();
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
                //that.render();
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

    this.deleteItem = function(id) {
        if (this.block_multiclick) return false;
        this.block_multiclick = true;
        this.db.collection('items').doc(id + '').delete().then(function() {
            that.init();
        });
        
        this.promise.then(function(){
            that.render();
        });
    };

    this.updateState = function(id) {
        if (this.block_multiclick) return false;
        this.block_multiclick = true;
        let sfDocRef = this.db.collection('items').doc(id + '');
        this.db.runTransaction(function(transaction) {
            return transaction.get(sfDocRef).then(function(sfDoc) {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }
                let completed = !sfDoc.data().completed;
                transaction.update(sfDocRef, { completed: completed });
            });
        }).then(function(){
            that.init();
        }).then(function() {
            that.render();
        });
    };

    this.addSomeData = function() {
        let data = {
            id: this.getMaxId(this.todosData) + 1,
            text: document.getElementById(this.addText).value,
            completed: false
        };

        if (data.text === '') {
            console.log('field is empty!');
            return false;
        };

        if (this.todosData.some(function(todo){
            return todo.text === data.text;
        })) {
            console.log('text "' + data.text + '" already exist!');
            return false;
        };

        let setDoc = that.db.collection('items').doc(data.id + '').set(data).then(function(){
            that.init();
        });
        
        this.promise.then(function(){
            that.render();
        });
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
        console.log(this.todosData);
        this.updateEventOnChange();
        this.block_multiclick = false;
    };
};

