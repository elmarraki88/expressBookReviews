const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else{
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.query.username;
  const password = req.query.password;

  if(username && password){
    if(!isValid(username)){
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
        return res.status(404).json({message: "Customer already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if(books.hasOwnProperty(isbn)){
    res.send(books[isbn]);
  } else {
    return res.status(403).json({message: "Book with the isbn " + isbn+ " not exist"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  let keys = Object.keys(books);
  let matchingBooks = [];
  keys.forEach(key => {
    if(books[key].author === author){
        let authorKey = books[key].author;
        let title = books[key].title;
        let reviews = books[key].reviews;
        let isbn = key;
        let info = {isbn, title, reviews};
        matchingBooks.push(info);
    }
  }) 
  let result = {[author]: matchingBooks}
  res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  let keys = Object.keys(books);
  let matchingBooks = [];
  keys.forEach(key => {
    if(books[key].title === title){
        let authorKey = books[key].author;
        let title = books[key].title;
        let reviews = books[key].reviews;
        let isbn = key;
        let info = {isbn, authorKey, reviews};
        matchingBooks.push(info);
    }
  }) 
  let result = {[title]: matchingBooks}
  res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  let reviews = books[isbn].reviews;
  res.send(reviews);
});

module.exports.general = public_users;
