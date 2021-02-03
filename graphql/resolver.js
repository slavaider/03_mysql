const Todo = require('../models/todo')

module.exports = {
    getTodos: async () => {
        try {
            return await Todo.findAll()
        } catch (e) {
            throw new Error('Fetch todos is not available')
        }
    },
    deleteTodo: async ({id}) => {
        try {
            const todos = await Todo.findAll({
                where: {
                    id
                }
            })
            const todo = todos[0]
            await todo.destroy()
            return id
        } catch (err) {
            throw new Error('Fetch todos is not available')
        }
    },
    completeTodo: async ({id}) => {
        try {
            const todo = await Todo.findByPk(+id)
            todo.done = true;
            await todo.save()
            return todo
        } catch (err) {
            throw new Error('Fetch todos is not available')
        }
    },
    createTodo: async ({todo}) => {
        try {
            return await Todo.create({
                title: todo.title,
                done: false
            })
        } catch (err) {
            throw new Error('Fetch todos is not available')
        }
    }
}
