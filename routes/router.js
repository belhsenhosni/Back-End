const express = require('express');
//const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../lib/db.js');
const userMiddleware = require('../middleware/users.js');
const app = express();


app.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
	
	db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'This email is already in use!'
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users (id, firstName, lastName, email, password, numTel, registered) VALUES (
			  '${uuid.v4()}',${db.escape(req.body.firstName)},${db.escape(req.body.lastName)},${db.escape(req.body.email)},${db.escape(hash)},${db.escape(req.body.numTel)}, now())`,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).send({
                  msg: 'User Registred Successfully!'
                });
              }
            );
          }
        });
      }
    }
  );
});



app.post('/login', (req, res, next) => {
	db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        throw err;
        return res.status(400).send({
          msg: 'email does not exist!'
        });
      }
      if (!result.length) {
        return res.status(401).send({
          msg: 'email does not exist!'
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'email or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                email: result[0].email,
                userId: result[0].id
              },
              'SECRETKEY', {
                expiresIn: '7d'
              }
            );
            db.query(
              `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'password is incorrect!'
          });
        }
      );
    }
  );
});


app.get('/users',(req, res) => {
     db.query('SELECT * FROM users', (err, result) =>{ 
         if (err) throw err;
         return res.send({message: 'users list' ,users: result });
     });
 });
 
 
 
app.get('/user/:id',(req, res) => {
     let userID = req.params.id;
     
     db.query('SELECT * FROM users where id=?', userID, (err, result)=> {
      if (result.length<1) {
		  //throw err;
	   return res.status(400).send
	  ({
          msg: 'user does not exist'
        });
		}
       return res.status(200).send
	   ({
		   user: result[0] 
		   });
     });
 });
 
  
app.get('/userm/:email',(req, res) => {
     let userEmail = req.params.email;
     
     db.query('SELECT * FROM users where email=?', userEmail, (err, result)=> {
      if (result.length<1) {
		  //throw err;
	   return res.status(400).send
	  ({
          msg: 'user does not exist'
        });
		}
       return res.status(200).send
	   ({
		   user: result[0] 
		   });
     });
 });







app.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});
module.exports = app;