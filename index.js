var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');
var dotenv = require('dotenv');
dotenv.config();

var app = express();

const {
    PORT = 4000, 
    HOST = 'localhost',
    USER = '',
    PASSWORD = '', 
    DATABASE = '' 
 } = process.env ;

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = {
  hello: () => "World"
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use((req, res, next) => {
    
  req.mysqlDb = mysql.createConnection({
    host     : HOST  ,
    user     : USER,
    password : PASSWORD,
    database : DATABASE
  });

  req.mysqlDb.connect();
  next();
}); 

app.listen(PORT);

console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);