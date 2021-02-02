new Vue({
    el: '#app',
    data() {
        return {
            isDark: true,
            show: true,
            todoTitle: '',
            todos: []
        }
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim()
            if (!title) {
                return
            }
            fetch('/api/todo', {
                method: "POST",
                body: JSON.stringify({title}),
                headers: {"Content-type": "application/json;charset=utf-8"}
            })
                .then(res => res.json())
                .then(data => {
                    this.todos.push(data);
                    this.todoTitle = ''
                }).catch(e => console.log(e));
        },
        removeTodo(id) {
            fetch(`/api/todo/${id}`, {
                method: "DELETE",
            }).then(() => {
                this.todos = this.todos.filter(todo => todo.id !== id)
            }).catch(e => console.error(e))
        },
        completeTodo(id) {
            fetch(`/api/todo/${id}`, {
                method: "PUT",
                headers: {"Content-type": "application/json;charset=utf-8"},
                body: JSON.stringify({done: true}),
            }).then(res => res.json()).then(data => {
                let idx = this.todos.findIndex(t => t.id === id)
                this.todos[idx].updatedAt = data.updatedAt
            }).catch(e => console.error(e))
        }
    },
    async created() {
        await fetch('/api/todo', {method: "GET"})
            .then(res => res.json())
            .then(data => this.todos = data)
            .catch(e => console.error(e));
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }
            if (withTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
        }
    }
})
