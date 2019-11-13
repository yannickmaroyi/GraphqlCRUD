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
    UNAME = 'user',
    PASSWORD = 'pass', 
    DATABASE = 'db' 
 } = process.env ;

// var schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);
var schema = buildSchema(`
  type User {
    id: String
    name: String
    job_title: String
    email: String
  }
  type Query {
    getUsers: [User],
    getUserInfo(id: Int) : User
  }
`);

const queryDB = (req, sql, args) => new Promise((resolve, reject) => {
    req.mysqlDb.query(sql, args, (err, rows) => {
        if (err)
            return reject(err);
        rows.changedRows || rows.affectedRows || rows.insertId ? resolve(true) : resolve(rows);
    });
});

var root = {
  getUsers: (args, req) => queryDB(req, "select * from users").then(data => data),
  getUserInfo: (args, req) => queryDB(req, "select * from users where id = ?", [args.id]).then(data => data[0])
};

// var root = {
//   hello: () => "World"
// };

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use((req, res, next) => {
    
  req.mysqlDb = mysql.createConnection({
    host     : HOST  ,
    user     : UNAME,
    password : PASSWORD,
    database : DATABASE
  });

  req.mysqlDb.connect();
  next();
}); 

app.listen(PORT);

console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);