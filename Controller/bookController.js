const Book = require("../Models/bookModel")
const joi = require("joi")
exports.showAvailableBooks = (request, response) => {
    const knex = request.app.locals.knex

    knex("Books")
        .select('bookid' , 'bookname' , 'bookpublisher' , 'bookprice' , 'booktitle' , 'bookcategory')
        .where('is_deleted', '=', '0')
        .then(data => {
            response.status(200).json(data)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        })
}
exports.showByCategory = (request, response) => {
    const knex = request.app.locals.knex
    const category = request.body.category
    knex("Books")
        .select('bookid','bookprice','bookname','booktitle','bookpublisher','bookcategory')
        .where('bookcategory', '=', category)
        .then(data => {
            response.status(200).json(data)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        })
}

exports.backupBookToStore = (request, response) => {

    const knex = request.app.locals.knex

    knex('Books')
        .where('bookid', '=', request.params.id)
        .update({
            is_deleted: '0',
        })
        .then(data => {
            response.status(200).json({
                status: "ok",
                msg: "restored"
            })
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}


exports.removeBookFromStore = (request, response) => {
    const knex = request.app.locals.knex

    knex('Books')
        .where('bookid', '=', request.params.id)
        .update({
            is_deleted: '1',
        })
        .then(data => {
            response.status(200).json({
                status: "DONE",
                msg: "BOOK HAS BEEN DELETED"
            })
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({
                status: "ERROR",
                msg: "500 Internal Server Error"
            })
        })
}


exports.addBookToStore = (request, response) => {
    const knex = request.app.locals.knex

    const name = request.body.name
    const publisher = request.body.publisher
    const category = request.body.category
    const price = request.body.price
    const title = request.body.title

    if (!title || !name || !category ||!publisher ||!price) {

        return response.status(400).json({
            status: "Error",
            msg: "Please enter the title ,name,price and Password of the admin to be created"
        })
    }
    const book = new Book('1',name,publisher,price,title,category)

    const bookSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).required(),
        name: joi.string().not().empty().min(3).max(20).pattern(/[a-z A-Z]{3,20}/).required(),
        publisher: joi.string().not().empty().min(8).max(200).required(),
        title: joi.string().not().empty().min(2).max(200).required(),
        price: joi.string().not().empty().min(1).max(5).required(),
        category: joi.string().min(1).max(25).required(),
    })

    const joiErrors = bookSchema.validate(book)
    if (joiErrors.error) {

        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }
    
        knex("books")
            .insert({
                bookname: book.name,
                bookpublisher: book.publisher,
                bookprice: book.price,
                booktitle: book.title,
                bookcategory:book.category

            })
            .then(data => {
                response.status(201).json({
                    status: "DONE",
                    msg: "Book has been added"
                })
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({
                    status: "ERROR",
                    msg: "500 Internal Server Error"
                })
            })

} 