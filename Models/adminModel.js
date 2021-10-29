class Admin{
    constructor(id , name , password , phone  , bcryptedPassword , email)
    {
        this.id=id;
        this.name=name;
        this.password = password;
        this.email=email;
        this.bcryptedPassword=bcryptedPassword;
        this.phone=phone;
    }
}
module.exports = Admin;