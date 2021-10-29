const bookRouter = require("express").Router();
const bookController = require("../Controller/bookController");
const middleWares = require("../util/middlewares")


bookRouter.get("/show",middleWares.checkUser,bookController.showAvailableBooks);//working
bookRouter.post("/Add",middleWares.checkAdmin, bookController.addBookToStore);//working
bookRouter.patch("/delete/:id", middleWares.checkAdmin,bookController.removeBookFromStore);//working
bookRouter.patch("/restore/:id",middleWares.checkAdmin, bookController.backupBookToStore);//working
bookRouter.post("/showByCategory",middleWares.checkUser,bookController.showByCategory);
module.exports  = bookRouter;