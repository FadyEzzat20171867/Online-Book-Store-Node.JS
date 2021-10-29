const orderRouter = require("express").Router()
const orderController = require("../Controller/orderController")
const middleWares = require("../util/middlewares")

orderRouter.post("/buy",middleWares.checkUser,orderController.buyBook)
module.exports = orderRouter