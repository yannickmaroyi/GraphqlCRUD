var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello: () => "World"
};

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use((req, res, next) => {
  req.mysqlDb = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'userapp'
  });
  req.mysqlDb.connect();
  next();
}); 

app.listen(4000);

console.log('Running a GraphQL API server at localhost:4000/graphql');