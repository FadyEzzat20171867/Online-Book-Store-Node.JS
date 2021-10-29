const Admin = require("../Models/adminModel.js");
const bcrypted = require("bcrypt");
const joi = require("joi")
const jwt=require("jsonwebtoken")

exports.adminLogin = (request, response) => {

    const knex = request.app.locals.knex
    const email = request.body.email
    const password = request.body.password
    if (!email || !password) {
        return response.status(400).json({
            status: "error",
            msg: "Please enter your email and password"
        })
    }

    knex("Admins")
        .select( 'email','password')
        .limit(1)
        .where('email', '=', email)
        .then(admin => {
            console.log(admin);
            if (admin[0] != null) {
                bcrypted.compare(password, admin[0].password, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    
                    if (result) {
                        const token = jwt.sign({
                            adminEmail: admin[0].email,
                            adminType:"admin"
                        }, "1337", {})
                        response.status(200).json({
                            status: "DONE",
                            msg: "You have successfully logged in "
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

exports.demoteAdmin = (request, response) => {
    const knex = request.app.locals.knex

    knex('Admins')
        .where('id', '=', request.params.id)
        .update({
            is_deleted: '1',
        })
        .then(data => {
            response.status(200).json({
                status: "ok",
                msg: "Admin has been deleted "
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
exports.showMyAdmins = (request, response) => {
    const knex = request.app.locals.knex

    knex("Admins")
        .select('id','name', 'email', 'phone_number')
        .where('is_deleted','=','0')
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
exports.makeAdmin = (request,response)=>{
    const knex = request.app.locals.knex

    const name = request.body.name
    const phone = request.body.phone
    const email = request.body.email
    const password = request.body.password

    if (!phone || !name || !email ||!password) {
        return response.status(400).json({
            status: "Error",
            msg: "Please enter the phone ,name,email and Password of the admin to be created"
        })
    }
    const admin = new Admin('1', name, password, phone, "x", email)

    const adminSchema = joi.object({
        id: joi.string().not().empty().min(1).max(50).required(),
        name: joi.string().not().empty().min(3).max(20).pattern(/[a-z A-Z]/).required(),
        password: joi.string().not().empty().min(8).max(200).required(),
        email: joi.string().email().min(8).max(50).required(),
        phone: joi.string().not().empty().min(3).max(20).pattern(/[0-9]{11}/).required(),
        bcryptedPassword: joi.string().min(1).max(100).required(),
    })

    const joiErrors = adminSchema.validate(admin)
    if (joiErrors.error) {

        console.log(joiErrors.error.details);
        return response.status(400).json({
            status: "error",
            msg: "400 Bad Request"
        })
    }
    bcrypted.hash(password, 5 , (error, hash)=> {
        if (error) {
            console.log(error);
        }
        admin.bcryptedPassword = hash
        knex("Admins")
            .insert({
                name: admin.name,
                phone_number: admin.phone,
                email: admin.email,
                password: admin.bcryptedPassword
            })
            .then(data => {
                response.status(201).json({
                    status: "ok",
                    msg: "Admin account has been created"
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
exports.restoreAdmin = (request,response)=>{
    const knex = request.app.locals.knex

    knex('Admins')
        .where('id', '=', request.params.id)
        .update({
            is_deleted: '0',
        })
        .then(data => {
            response.status(200).json({
                status: "ok",
                msg: "Admin has been restored "
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
