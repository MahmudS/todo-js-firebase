'use strict';

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
        return new Promise((resolve) => {
            this.firebase.initializeApp(this.config);
            this.db = this.firebase.firestore();
            resolve();
        })
    };

    load() {
        this.todosData = [];
        return new Promise((resolve) => {
            this.db.collection(this.collection).get().then((querySnapshot) => {
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
        return new Promise((resolve, reject) => {
            return this.db.collection(this.collection).doc(id + '').delete().then(
                () => {
                    resolve();
                }, (err) => {
                    reject(err);
                }
            );
        });
    }

    update(id) {
        return new Promise((resolve, reject) => {
            let docRef = this.db.collection(this.collection).doc(id + '');
            this.db.runTransaction((transaction) => {
                return transaction.get(docRef).then((sfDoc) => {
                    if (!sfDoc.exists) {
                        reject({err: "Document does not exist!"});
                    }
                    let completed = !sfDoc.data().completed;
                    transaction.update(docRef, {completed: completed});
                    resolve();
                });
            });
        });
    }

    add(data) {
        return new Promise((resolve, reject) => {
            this.db.collection(this.collection).doc(data.id + '').set(data).then(
                () => {
                    resolve();
                }, (err) => {
                    reject(err);
                }
            );
        });
    }

    compareNumeric(first, second) {
        let a = +first.id;
        let b = +second.id;
        if (a > b) return 1;
        if (a < b) return -1;
    }
}