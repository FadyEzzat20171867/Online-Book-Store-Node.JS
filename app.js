const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const conn = require("./Database/myConnection");

const bookRouter = require("./Routes/bookRouter");
const adminRouter = require("./Routes/adminRouter");
const customerRouter = require("./Routes/customerRoutes");
const orderRouter = require("./Routes/orderRouter");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}))

app.use(morgan("dev"));

app.use(cors());

app.use("/customer", customerRouter);
app.use("/admin", adminRouter);
app.use("/book", bookRouter);
app.use("/order",orderRouter);

const knex = conn.openConnection();
app.locals.knex = knex;

module.exports = app;


