const Book = require("../models/Book")

function bookService() {
    async function getBooks() {
        return Book.find({});
    }

    async function addBook(title, author, isbn) {
        return Book.create({Title: title, Author: author, ISBN: isbn})
    }

    async function deleteBook(isbn) {
        return Book.deleteOne({ISBN: isbn})
    }

    return {
        getBooks,
        addBook,
        deleteBook
    }
}

module.exports = bookService;