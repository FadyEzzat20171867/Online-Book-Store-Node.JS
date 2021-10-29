const customerRouter = require("express").Router()
const customerController = require("../Controller/customerController")
const middleWares = require("../util/middlewares")

customerRouter.post("/register",customerController.userRegister)//working
customerRouter.post("/login", customerController.userLogin)// working
customerRouter.get("/showUsers", middleWares.checkAdmin,customerController.showMyUsers)
customerRouter.patch("/delete/:id",middleWares.checkUser, customerController.deleteMyAccount)
customerRouter.patch("/restore/:id", middleWares.checkUser,customerController.backupMyAccount)

module.exports = customerRouter