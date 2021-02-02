const express = require('express')
const path = require('path')
const app = express()
const sequelize = require('./utils/database')
const TodoRoutes = require('./routes/todo')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use('/api/todo', TodoRoutes)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

const PORT = process.env.PORT || 3000

const start = async () => {
    try{
        await sequelize.sync()
        app.listen(PORT)
    }catch(err){
        console.log(err)
    }

}
start()
