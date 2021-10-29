const adminRouter = require("express").Router()
const adminController = require("../Controller/adminController")
const middleWares = require("../util/middlewares")

adminRouter.post("/adminLogin", adminController.adminLogin)//working
adminRouter.post("/add",middleWares.checkAdmin,adminController.makeAdmin)//working
adminRouter.get("/showAdmins", middleWares.checkAdmin,adminController.showMyAdmins)//working
adminRouter.patch("/delete/:id", middleWares.checkAdmin,adminController.demoteAdmin)//working
adminRouter.patch("/restore/:id",middleWares.checkAdmin,adminController.restoreAdmin)//working


module.exports = adminRouter