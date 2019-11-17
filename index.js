var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');
var dotenv = require('dotenv');
var cors = require('cors');
var bodyParser = require('body-parser');
dotenv.config();

var app = express();

// using cors middleware
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
    getUserInfo(id: Int) : User,
    hello:String
  }
  type Mutation {
    updateUserInfo(id: Int, name: String, email: String, job_title: String): Boolean
    createUser(name: String, email: String, job_title: String): Boolean
    deleteUser(id: Int): Boolean
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
  getUserInfo: (args, req) => queryDB(req, "select * from users where id = ?", [args.id]).then(data => data[0]),
  updateUserInfo: (args, req) => queryDB(req, "update users SET ? where id = ?", [args, args.id]).then(data => data),
  createUser: (args, req) => queryDB(req, "insert into users SET ?", args).then(data => data),
  deleteUser: (args, req) => queryDB(req, "delete from users where id = ?", [args.id]).then(data => data)
};

// var root = {
//   hello: () => "World"
// };
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

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(PORT);

console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);