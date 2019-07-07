let block_multiclick = false;

function compareNumeric(first, second) {
    let a = +first.id;
    let b = +second.id;
    if (a > b) return 1;
    if (a < b) return -1;
}

function init() {
    todosData = [];
    let docRef =  db.collection('items').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            todosData.push(doc.data());
        });
    }).then(function(){
        todosData.sort(compareNumeric);
        render();
    });
}

function getMaxId() {
    let max = todosData.reduce(function(max, todo) {
      return (max > todo.id) ? max : todo.id;
    }, 0);
    return max;
}

function deleteItem(id) {
    if (block_multiclick) return false;
    block_multiclick = true;
    
    db.collection('items').doc(id + '').delete().then(function() {
        init();
    });
    /*
    todosData = todosData.filter(todo => {
        return (todo.id !== id)
    });
    render();
    */
}


function updateState(id) {
    if (block_multiclick) return false;
    block_multiclick = true;
    let sfDocRef = db.collection('items').doc(id + '');
    db.runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var completed = !sfDoc.data().completed;
            transaction.update(sfDocRef, { completed: completed });
        });
    }).then(function(){
        init();
    });
    /*
    todosData.forEach(function(item, i, arr){
        if (item.id == id) {
            arr[i].completed = !arr[i].completed;
        }
    });
    render();
    */
}

function addSomeData() {
    let data = {
        id: getMaxId() + 1,
        text: document.getElementById('addText').value,
        completed: false
    };

    if (data.text === '') {
        console.log('field is empty!');
        return false;
    };

    if (todosData.some(function(todo){
        return todo.text === data.text;
    })) {
        console.log('text "' + data.text + '" already exist!');
        return false;
    };

    let setDoc = db.collection('items').doc(data.id + '').set(data);
    init();
}

function render(){
    let html = '';
    todosData.forEach(function(item, i, arr){
        let checked = '';
        if (item.completed) {
            checked = ' checked="checked"';
        }
        html += '<div class="todo-item"><input type="checkbox"' + checked + ' id="checkbox_id_' + item.id + '" onchange="updateState(' + item.id + ');"><label for="checkbox_id_' + item.id + '">' + item.text + '</label><span class="deleteItem" onclick="deleteItem(' + item.id + ');">X</span></div>';
    });
    document.getElementById('todo-items').innerHTML = html;
    block_multiclick = false;
}

addTextButton.onclick = function(event) {
    addSomeData();
}

var firebaseConfig = {
    apiKey: "AIzaSyBw2fryKRndsw9XU_0WiYz7CNaUtQHT1Tw",
    authDomain: "test-js-90c47.firebaseapp.com",
    databaseURL: "https://test-js-90c47.firebaseio.com",
    projectId: "test-js-90c47",
    storageBucket: "",
    messagingSenderId: "663568654522",
    appId: "1:663568654522:web:f77027a05072ca18"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let todosData = [];

init(); 