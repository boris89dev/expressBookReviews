
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let existingUser = users.filter((user)=>{ return user.username === username });
    return existingUser.length > 0;
}

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });    
    return validUsers.length > 0;
}

regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;  

  if (!username || !password) 
      return res.status(404).json({message: "Error logging in"});
  
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: {username: username, password: password}}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username};    
    return res.status(200).send({accessToken: accessToken});
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
// Hint: You have to give a review as a request query & it must get posted with 
// the username  (stored in the session) posted
// review as a request query (but PUT request)?? something is not clear here
// Task 8 - Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    let filtered_book = books[isbn]
    if (filtered_book) {
        let review = req.query.review;
        let reviewer = req.session.authorization['username'];
        if(review) {
            filtered_book['reviews'][reviewer] = review;
            books[isbn] = filtered_book;
        }
        res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
    }
    else{
        res.send("Unable to find this ISBN!");
    }
  });

// Task 9 - Deleting a book review

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let reviewer = req.session.authorization['username'];
    let filtered_review = books[isbn]["reviews"];
    if (filtered_review[reviewer]){
        delete filtered_review[reviewer];
        res.send(`Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`);
    }
    else{
        res.send("Can't delete, as this review has been posted by a different user");
    }
    });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
