const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password)
  {
    if(isValid(username))
    {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    }
    else
    {
      return res.status(404).json({message: "User already exists!"});  
    }
  }
  else
  {
    if(username)
      return res.status(404).json({message: "Please insert a suitable password"});
    else if(password)
      return res.status(404).json({message: "Please insert a suitable username"});
    else
    return res.status(404).json({message: "Please insert a suitable username and password"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  
  const getBooks = () => new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)}, 1000)});

  const booksData = await getBooks();
  return res.status(200).send(JSON.stringify(booksData, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  const getBook = () => new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books[isbn])}, 1000)});

  const bookData = await getBook();
  return res.status(200).send(bookData);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;
  const authBooks = {};

  const getBook = () => new Promise((resolve,reject) => {
    setTimeout(() => {
      for (const [key, value] of Object.entries(books)) 
        {
          if(value.author === author)
          { 
            authBooks[key] = 
            {
              "author": value.author,
              "title": value.title,
              "reviews": value.reviews
            }
          }
        }
      resolve(authBooks)}, 1000)});
  
  const bookData = await getBook();
  return res.status(200).send(bookData);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const titleBook = {};

  const getBook = () => new Promise((resolve,reject) => {
    setTimeout(() => {
      for (const [key, value] of Object.entries(books)) 
        {
          if(value.title === title)
          { 
            titleBook[key] = 
            {
              "author": value.author,
              "title": value.title,
              "reviews": value.reviews
            }
            break;
          }
        }
      resolve(titleBook)}, 1000)});

  const bookData = await getBook();
  return res.status(200).send(bookData);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).send(books[isbn].reviews);
});

module.exports.general = public_users;
