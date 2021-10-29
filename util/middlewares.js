const jwt = require("jsonwebtoken")

exports.checkUser = (request, response, next) => {
    const headerData = request.headers.authorization.split(" ")
    const token = headerData[1]

    if (!token) {
        return response.status(401).json({
            status:"error",
            msg:"401 not Auth"
        })
    }
    else{
        jwt.verify(token, '1111', (error, data) => {
            if (error) {
                return response.status(401).json({
                    status:"error",
                    msg:"401 not Auth"
                })
            } else {
                next()
            }
        })
        
    }
    
}

exports.checkAdmin = (request, response, next) => {
    const headerData = request.headers.authorization.split(" ")
    const token = headerData[1]

    if (!token) {
        return response.status(401).json({
            status:"error",
            msg:"401 not Auth"
        })
    }
    else{
        jwt.verify(token, '1337', (error, data) => {
            if (error) {
                return response.status(401).json({
                    status:"error",
                    msg:"401 not Auth"
                })
            } else {
                next()
            }
        })
        
    }
    
}