const express = require('express');
var bodyParser = require('body-parser');
const database = require('./database');

const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());
/*
 * Route         "/"
 * Description   Get all the books
 * Access        PUBLIC
 * Parameters    NONE
 * Methods       Get
 */

booky.get('/', (req, res) => {
  return res.json({ books: database.books });
});

/*
 * Route         "/is"
 * Description   Get specific books on ISBN
 * Access        PUBLIC
 * Parameters    ISBN
 * Methods       Get
 */

booky.get('/is/:isbn', (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );

  if (!getSpecificBook.length) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
 * Route         "/c"
 * Description   Get specific books on Category
 * Access        PUBLIC
 * Parameters    category
 * Methods       Get
 */

booky.get('/c/:category', (req, res) => {
  const getSpecificBook = database.books.filter((book) =>
    book.category.includes(req.params.category)
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
 * Route         "/d"
 * Description   Get specific books on language
 * Access        PUBLIC
 * Parameters    language
 * Methods       Get
 */

booky.get('/d/:language', (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );
  if (getSpecificBook.length === 0) {
    return res.json({
      error: `No book found for the category of ${req.params.language}`,
    });
  }
  return res.json({ book: getSpecificBook });
});

/*
 * Route         "/authors"
 * Description   Get all the authors
 * Access        PUBLIC
 * Parameters    none
 * Methods       Get
 */

booky.get('/author', (req, res) => {
  return res.json({ author: database.author });
});

/*
 * Route         "/author"
 * Description   Get specific author on id
 * Access        PUBLIC
 * Parameters    i
 * Methods       Get
 */

booky.get('/author/:id', (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id == req.params.id
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the id of ${req.params.id}`,
    });
  }
  return res.json({ author: getSpecificAuthor });
});

/*
 * Route         "/authors/book"
 * Description   Get a list of authors based on books
 * Access        PUBLIC
 * Parameters    isbn
 * Methods       GET
 */

booky.get('/author/book/:isbn', (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor.length === 0) {
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`,
    });
  }
  return res.json({ authors: getSpecificAuthor });
});

/*
 * Route         "/publication"
 * Description   Get all the publications
 * Access        PUBLIC
 * Parameters    none
 * Methods       GET
 */

booky.get('/publication', (req, res) => {
  return res.json({ publication: database.publication });
});

/*
 * Route         "/publication"
 * Description   Get a publication based on id
 * Access        PUBLIC
 * Parameters    id
 * Methods       GET
 */

booky.get('/publication/:id', (req, res) => {
  const getSpecificPublicaiton = database.publication.filter(
    (publication) => publication.id == req.params.id
  );
  if (getSpecificPublicaiton.length === 0) {
    error: `No publicaiton found for the id of ${req.params.id}`;
  }
  return res.json({ publication: getSpecificPublicaiton });
});

/*
 * Route         "/publication"
 * Description   Get a publication based on book
 * Access        PUBLIC
 * Parameters    id
 * Methods       GET
 */

booky.get('/publication/:books', (req, res) => {
  const getSpecificPublicaiton = database.publication.filter(
    (publication) => publication.books == req.params.books //this is the condition filter requires for modifying the array
  );
  if (getSpecificPublicaiton.length === 0) {
    error: `No publicaiton found for the id of ${req.params.books}`;
  }
  return res.json({ publication: getSpecificPublicaiton });
});

//! POST requests
//add bew book
//add new publication
//add new author

/*
 * Route         "/book/new"
 * Description   Add new book
 * Access        PUBLIC
 * Parameters    None
 * Methods       POST
 */

booky.post('/book/new', (req, res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({ updateBooks: database.books });
});
/*
 * Route         "/publication/new"
 * Description   Add new publicaiton
 * Access        PUBLIC
 * Parameters    None
 * Methods       POST
 */

booky.post('/publication/new', (req, res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json({ updatepublication: database.publication });
});
/*
 * Route         "/author/new"
 * Description   Add new author
 * Access        PUBLIC
 * Parameters    None
 * Methods       POST
 */

booky.post('/author/new', (req, res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({ updateAuthor: database.author });
});

//! PUT
// update book details if publicaiton is changed

/*
 * Route         "/publication/update/book"
 * Description   update or /add new publicaiton
 * Access        PUBLIC
 * Parameters    isbn
 * Methods       PUT
 */
booky.put('/publication/update/book/:isbn', (req, res) => {
  //update the publication database
  database.publication.forEach((pub) => {
    if (pub.id === req.body.pubId) {
      return pub.books.push(req.body.isbn);
    }
  });

  //update the books database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubId;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publication,
    message: 'successfully updated',
  });
});

//! DELETE
// Delete a book
// Delete author from book
//Delete author from book and related book from auhtor

/*
 * Route         "/book/delete/author"
 * Description   Delete a author of a book
 * Access        PUBLIC
 * Parameters    isbn, authorId
 * Methods       DELETE
 */

booky.delete('/book/delete/author/:isbn', (req, res) => {
  // whichever book that odoesnot match with the isbn , just send it to a update book database arry and rest will be filtered
  const updatedBookAuthorDatabase = database.books.author.filter(
    (author) => author.id !== req.body.id
  );

  database.books.author = updatedBookAuthorDatabase;
  return res.json({ books: database.books });
});

booky.delete('/book/delete/author/:isbn/:authorId', (req, res) => {
  //update the book database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }

    //updateing the author database
    database.author.forEach((eachAuthor) => {
      if (eachAuthor.id === parseInt(req.params.authorId)) {
        const newBookList = eachAuthor.books.filter(
          (book) => book !== req.params.isbn
        );
        eachAuthor.book = newBookList;
        return;
      }
    });
    return res.json({
      book: database.books,
      author: database.author,
      message: 'author was deleted!!',
    });
  });
});

/*
 * Route         "/book/delete"
 * Description   Delete a book
 * Access        PUBLIC
 * Parameters    isbn
 * Methods       DELETE
 */

booky.listen(3000, () => {
  console.log('Server is up and running on port 3000');
});
