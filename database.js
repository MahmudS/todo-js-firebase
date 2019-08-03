'use strict'

class database {
    constructor(firebase) {
        this.config = {
            apiKey: "AIzaSyBw2fryKRndsw9XU_0WiYz7CNaUtQHT1Tw",
            authDomain: "test-js-90c47.firebaseapp.com",
            databaseURL: "https://test-js-90c47.firebaseio.com",
            projectId: "test-js-90c47",
            storageBucket: "",
            messagingSenderId: "663568654522",
            appId: "1:663568654522:web:f77027a05072ca18"
        };
        this.firebase = firebase;
        this.collection = 'items';
    }

    set config(config) {
        this._config = config;
    }

    get config() {
        return this._config;
    }

    set firebase(firebase) {
        this._firebase = firebase;
    }

    get firebase() {
        return this._firebase;
    }

    connect() {
        this.firebase.initializeApp(this.config);
        this.db = this.firebase.firestore();
    };

    load() {
        this.todosData = [];
        this.promise = new Promise((resolve, reject) => {
            let docRef =  this.db.collection(this.collection).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.todosData.push(doc.data());
                });
            }).then(() => {
                this.todosData.sort(this.compareNumeric);
                resolve();
            });
        });
    }

    delete(id) {
        this.db.collection(this.collection).doc(id + '').delete();
    }

    update(id) {
        let docRef = this.db.collection(this.collection).doc(id + '');
        this.db.runTransaction((transaction) => {
            return transaction.get(docRef).then((sfDoc) => {
                if (!sfDoc.exists) {
                    throw "Document does not exist!";
                }
                let completed = !sfDoc.data().completed;
                transaction.update(docRef, { completed: completed });
            });
        });
    }

    add(data) {
        let setDoc = this.db.collection(this.collection).doc(data.id + '').set(data);
    }

    compareNumeric(first, second) {
        let a = +first.id;
        let b = +second.id;
        if (a > b) return 1;
        if (a < b) return -1;
    }
}