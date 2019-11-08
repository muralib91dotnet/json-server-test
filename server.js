#!/usr/bin/env node

'use strict';
const args = require('yargs').argv;
var path = require('path'); 

console.log('File Name: ' + args.fileName);

const filePath=path.join(__dirname, args.fileName);
console.log('File path given: ' + filePath);
// var currentPath = process.cwd();

const jsonServer = require('json-server');
const server = jsonServer.create();
// const router = jsonServer.router('./db.json');
const router = jsonServer.router(filePath)

const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;
var db = require(filePath);

console.log("Initializing Server JS")


server.use(jsonServer.bodyParser);
server.use(middlewares);

server.use(jsonServer.rewriter({
  '/api/users': '/users'
}));

console.log("users Api init")


server.post('/post/user', (req, res) => {
  if (req.method === 'POST') {
    let userId = req.body['userId'];
    if (userId != null && userId >= 0) {
      let result = db.users.find(user => {
        return user.userId == userId;
      })

      if (result) {
        let {id, ...user} = result;
        res.status(200).jsonp(user);
      } else {
        res.status(400).jsonp({
          error: "Bad userId"
        });
      }
    } else {
      res.status(400).jsonp({
        error: "No valid userId"
      });
    }
  }
});

server.get('/get/user', (req, res) => {
  if (req.method === 'GET') {
    let userId = req.query['userId'];
    if (userId != null && userId >= 0) {
      let result = db.users.find(user => {
        return user.userId == userId;
      })

      if (result) {
        let {id, ...user} = result;
        res.status(200).jsonp(user);
      } else {
        res.status(400).jsonp({
          error: "Bad userId"
        });
      }
    } else {
      res.status(400).jsonp({
        error: "No valid userId"
      });
    }
  }
});

server.use(router);
server.listen(port, () =>{ console.log(`Running on localhost:${port}`)});

