class Customer {

    constructor(id , email , name , address , phone , password , bcryptedPassword)
    {
        this.id = id;
        this.phone = phone;
        this.password = password;
        this.email = email;
        this.address = address;
        this.bcryptedPassword=bcryptedPassword;
        this.name = name;
    }
    
}

module.exports = Customer;