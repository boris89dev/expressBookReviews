const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  users.push({ username, password });
  console.log(users); // Verifica che l'utente sia stato aggiunto
  res.status(201).json({ message: 'User registered successfully' });
});



// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const formattedBooks = JSON.stringify(books, null, 2);
  res.send(formattedBooks);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const bookId = req.params.isbn;
  
    const book = books[bookId];
  
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
  

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const result = [];
    Object.keys(books).forEach(key => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        result.push(books[key]);
      }
    });
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Books by this author not found' });
    }
  });
  

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const result = [];
    Object.keys(books).forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        result.push(books[key]);
      }
    });
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Books by this title not found' });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const bookId = req.params.isbn;
  const book = books[bookId];
  if (book && Object.keys(book.reviews).length > 0) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: 'Reviews not found' });
  }
});
  

module.exports.general = public_users;
