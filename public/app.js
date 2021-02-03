// noinspection JSUnusedGlobalSymbols
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
            const query = `
               mutation {
	            createTodo(todo:{title:"${title}"}){
                title id createdAt updatedAt done
                    }  
                }
            `
            fetch('/graphql', {
                method: 'POST',
                headers: {"Accept": "application/json", "Content-type": "application/json;charset=utf-8"},
                body: JSON.stringify({query})
            }).then(res => res.json())
                .then(response => {
                    const todo = response.data.createTodo
                    this.todos.push(todo)
                    this.todoTitle = ''
                })
        },
        removeTodo(id) {
            const query = `
           mutation
           {
               deleteTodo(id:"${id}")
           }
            `
            fetch('/graphql', {
                method: 'POST',
                headers: {"Accept": "application/json", "Content-type": "application/json;charset=utf-8"},
                body: JSON.stringify({query})
            }).then(res => res.json()).then((response) => {
                this.todos = this.todos.filter(todo => todo.id !== response.data.deleteTodo)
            }).catch(e => console.error(e))
        },
        completeTodo(id) {
            const query = `
           mutation
           {
               completeTodo(id:"${id}"){updatedAt}
           }
            `
            fetch('/graphql', {
                method: 'POST',
                headers: {"Accept": "application/json", "Content-type": "application/json;charset=utf-8"},
                body: JSON.stringify({query})
            }).then(res => res.json()).then(response => {
                let idx = this.todos.findIndex(t => t.id === id)
                this.todos[idx].updatedAt = response.data.completeTodo.updatedAt
            }).catch(e => console.error(e))
        }
    },
    async created() {
        const query = `
           query
           {
                getTodos{ id title done createdAt updatedAt}
           }
        `
        fetch('/graphql', {
            method: 'POST',
            headers: {"Accept": "application/json", "Content-type": "application/json;charset=utf-8"},
            body: JSON.stringify({query})
        }).then(res => res.json())
            .then(response => {
                this.todos = response.data.getTodos
            })
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
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(+value))
        }
    }
})
