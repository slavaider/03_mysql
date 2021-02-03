const express = require('express')
const path = require('path')
const app = express()
// sequelize
const sequelize = require('./utils/database')
// GraphQL
const {graphqlHTTP} = require('express-graphql');
const resolver = require('./graphql/resolver')
const {loadSchemaSync, GraphQLFileLoader} = require('graphql-tools')
const schema = loadSchemaSync(path.join(__dirname, '/graphql/schema.graphql'), {loaders: [new GraphQLFileLoader()]});
// Static dir
app.use(express.static(path.join(__dirname, 'public')));
// Methods Parse
app.use(express.json())
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolver,
    graphiql: true
}))
// Default layout
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await sequelize.sync()
        app.listen(PORT)
    } catch (err) {
        console.log(err)
    }

}
start()
