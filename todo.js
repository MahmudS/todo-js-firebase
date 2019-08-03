'use strict'

class todoClass extends database {
    constructor(firebase) {
        super(firebase);
        this.addText = 'addText';
        this.testmode = false;
    }
    
    initAddButton(button_name) {
        let addTextButton = document.getElementById(button_name);
        addTextButton.onclick = (event) => {
            let value = document.getElementById(this.addText).value;
            let result = this.addSomeData(value);
            if (!result.status) {
                console.log(result.text);
            }
        }
    };
    
    load() {
        super.load();
    };

    getMaxId() {
        let max = this.todosData.reduce((max, todo) => {
          return (max > todo.id) ? max : todo.id;
        }, 0);
        return max;
    };
    
    getKeyForId(id) {
        let result = false;
        this.todosData.forEach((item, i, arr) => {
            if (item.id === id) result = i;
        });
        return result;
    }

    deleteItem(id) {
        let key = this.getKeyForId(id);
        if (key !== false) {
            this.todosData.splice(key, 1);
            if (!this.testmode) {
                super.delete(id);
            }
            this.render();
        }
    };

    updateState(id) {
        let key = this.getKeyForId(id);
        if (key !== false) {
            this.todosData[key].completed = !this.todosData[key].completed;
            if (!this.testmode) {
                super.update(id);
            }
            this.render();
        }
    };

    addSomeData(value) {
        let data = {
            id: this.getMaxId() + 1,
            text: value,
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

        if (this.todosData.some((todo) => {
            return todo.text === data.text;
        })) {
            result.status = false;
            result.text = 'text "' + data.text + '" already exist!';
            return result;
        };

        this.todosData.push(data);
        if (!this.testmode) {
            super.add(data);
        }

        this.render();
        
        return result;
    };
    
    updateEventOnChange() {
        this.todosData.forEach((item, i, arr) => {
           let elem = document.getElementById('checkbox_id_' + item.id);
           elem.onchange = (event) => {
               this.updateState(item.id);
           };
           let span = document.getElementById('delete_item_' + item.id);
           span.onclick = (event) => {
               this.deleteItem(item.id);
           };
        });
    };
    
    getHtmlItem(item) {
        let checked = '';
        if (item.completed) {
            checked = ' checked="checked"';
        }
        return '<div class="todo-item"><input type="checkbox"' + checked + ' id="checkbox_id_' + item.id + '"><label for="checkbox_id_' + item.id + '">' + item.text + '</label><span class="deleteItem" id="delete_item_' + item.id + '">X</span></div>';
    };

    render(){
        let html = '';
        this.todosData.forEach((item, i, arr) => {
            html += this.getHtmlItem(item);
        });
        document.getElementById('todo-items').innerHTML = html;
        this.updateEventOnChange();
    };
};

