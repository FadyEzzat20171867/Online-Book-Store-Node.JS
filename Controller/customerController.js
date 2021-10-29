const User = require("../Models/customerModel")
const bcrypted = require("bcrypt");
const Customer = require("../Models/customerModel");
const joi = require("joi")
const jwt = require("jsonwebtoken");

exports.userRegister = (request, response) => {
    const knex = request.app.locals.knex;

    const name = request.body.name;
    const phone = request.body.phone;
    const email = request.body.email;
    const password = request.body.password;
    const address = request.body.address;

    if (!name || !phone || !email || !password|| !address ) {
        return response.status(400).json({
            status: "error",
            msg: "You have to enter name , phone , email , password and address to register , Thank you!"
        })
    }
    const customer = new Customer('1',email,name,address,phone,password,"ash")
    const customerSchema = joi.object({

        id: joi.string().not().empty().min(1).max(50).required(),
        name: joi.string().not().empty().min(3).max(20).pattern(/[a-z A-Z]{3,20}/).required(),
        password: joi.string().not().empty().min(8).max(200).required(),
        email: joi.string().email().min(8).max(50).required(),
        address: joi.string().not().empty().min(3).max(200).required(),
        phone: joi.string().not().empty().min(3).max(20).pattern(/[0-9]{11}/).required(),
        bcryptedPassword: joi.string().min(1).max(100).required()

    })

    const joiErrors = customerSchema.validate(customer)
    if (joiErrors.error) {

        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }
    bcrypted.hash(password, 10 ,  (error, hashedPassword) => {
        if (error) {
            console.log(error);
        }
        
        customer.bcryptedPassword = hashedPassword
        knex("Customers")
            .insert({
                customer_name : customer.name,
                customer_phone : customer.phone,
                email : customer.email,
                customer_password : customer.bcryptedPassword,
                customer_address : customer.address

            })
            .then(data => {
                response.status(201).json({
                    status: "ok",
                    msg: "Customer account has been created"
                })
            })
            .catch(error => {
                console.log(error);
                response.status(500).json({
                    status: "error",
                    msg: "500 Internal Server Error"
                })
            })



    });

}
exports.userLogin = (request, response) => {
    const knex = request.app.locals.knex

    const email = request.body.email
    const password = request.body.password
    if (!email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }

    knex("Customers")
        .select('customer_id','customer_name', 'email','customer_password')
        .limit(1)
        .where('email', '=', email)
        .then(customer => {
            console.log(customer);
            if (customer[0] != null) {
                bcrypted.compare(password, customer[0].customer_password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    if (result) {
                        const token = jwt.sign({
                            userEmail: customer[0].email,
                            usertype:"customer"
                        }, "1111", {})
                        response.status(200).json({

                            status: "DONE",
                            msg: "You have been logged in successfully !!"
                        })
                    } else {
                        response.status(401).json({
                            status: "ERROR",
                            msg: "Incorrect Password"
                        })
                    }
                })

            } else {
                response.status(401).json({
                    status: "error",
                    msg: "401 not Auth"
                })
            }
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 Internal Server Error"
            })
        })
}
exports.showMyUsers = (request, response) => {
    const knex = request.app.locals.knex

    knex("Customers")
        .select('customer_id','email','customer_name','customer_address','customer_phone')
        .where('is_deleted', '=', '0')
        .then(user => {
            response.status(200).json(user)
        })
        .catch(error => {
            console.log(error);
            response.status(500).json({
                status: "error",
                msg: "500 internal server error"
            })
        })
}

exports.deleteMyAccount = (request, response) => {
    const knex = request.app.locals.knex
    const customerID = request.params.id
    knex('Customers')
        .where('customer_id', '=' , customerID)
        .update({
            is_deleted : '1',
        })

        .then(data => {
            response.status(200).json({
                status: "Done",
                msg: "Account has been deleted"
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

exports.backupMyAccount = (request, response) => {

    const knex = request.app.locals.knex;
    const customerID = request.params.id;
    knex('Customers')
        .where('customer_id', '=', customerID)
        .update({
            is_deleted: '0',
        })
        .then(data => {
            response.status(200).json({
                status: "Done",
                msg: "Account has been restored"
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