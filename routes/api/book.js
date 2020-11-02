const Router = require("express").Router;
const bookService = require("../../services/book.service")();
const Book = require("../../models/Book");

const router = Router({
    mergeParams: true,
  });

router.get("/getBooks", async(req, res, next) => {
    try{
        const books = await bookService.getBooks();
        res.send(books)
    }
    catch(err) {
        res.send({msg: "Failed to get books"})
    }
});

//Route to create a book
router.post("/addBook", async(req, res, next) => {
    try {
        const {title, author, isbn} = req.body;
        await bookService.addBook(title, author, isbn);
        res.send({ success: true, msg: "Book Added"});
    } catch (err) {
        res.send({ success: false, msg: "Book not Added!", err})
    }
});

//Route to delete a book
router.delete("/deleteBook/:isbn", async(req, res, next) => {
    try {
        const isbn = req.params.isbn;
        await bookService.deleteBook(isbn);
        res.send({ success: true, msg: "Book deleted"})
    } catch (error) {
        res.send({ success: false, msg: "Book not Added!"})
    }
});

module.exports = router;