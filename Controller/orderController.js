const Order = require("../Models/orderModel")
const joi = require("joi")

exports.buyBook = (request,response)=>{
    const knex = request.app.locals.knex

    const customerID = request.body.customerID
    const bookID = request.body.bookID

    if (!bookID || !customerID ) {
        return response.status(400).json({
            status: "Error",
            msg: "Please enter your ID and id of book needed to buy"
        })
    }
    const order = new Order(bookID,customerID)

    const orderSchema = joi.object({
        bookID: joi.string().not().empty().min(1).max(50).required(),
        customerID: joi.string().not().empty().min(1).max(50).required()
        
    })

    const joiErrors = orderSchema.validate(order)
    if (joiErrors.error) {

        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }
        knex("order")
            .insert({
                customers_customer_id: order.customerID,
                books_bookid: order.bookID,
            })
            .then(data => {
                response.status(201).json({
                    status: "ok",
                    msg: "Book has been added to the cart"
                })
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({
                    status: "error",
                    msg: "500 Internal Server Error"
                })
            })

        }
