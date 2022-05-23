const userModel = require("../models/userModel");
const EmailValidator=require('email-validator');
const jwt = require("jsonwebtoken")
const Validator= require("../validator/validation")


  
  const createUser= async function (req, res) {
     try {
      let data= req.body
      const {title, name, phone, email, password, address}= data

      if (!Validator.isValidRequestBody(data)) {
          return res.status(400).send({status: false, msg: "please provide some data"})
      }
      if (!title) {
        return res.status(400).send({status: false, msg: "please provide title field."})
      }
    if (!Validator.isValidTitle(title)) {
        return res.status(400).send({status: false, msg: "please provide valid title."})
    }

    if (!name) {
        return res.status(400).send({status: false, msg: "please provide name."})
    }
    
    if(!Validator.isValid(name)) {
        return res.status(400).send({status: false, msg: "please provide valid name."})
    }

    if(!phone) {
        return res.status(400).send({status: false, msg: "please provide phone number"})
    }
    if (!/^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/.test(phone)) {
        return  res.status(400).send({ status: false, msg: "It's not a valid mobile number" })
    }

    const uniquePhone= await userModel.findOne({phone:phone})
    if (uniquePhone) {
        return res.status(400).send({ status: false, msg: "Phone no. is already registered" })
    }

    if(!email) {
        return res.status(400).send({status: false, msg: "please provide email"})
    }

    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
       return res.status(400).send({ status: false, msg: "Please provide correct email formate" })
    }

    const uniqueEmail= await userModel.findOne({email:email})
    if (uniqueEmail) {
        return res.status(400).send({ status: false, msg: "email already registered" })
    }


    if (!password) {
        return res.status(400).send({ status: false, msg: "Please provide password" })
    }

    if (!/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/.test(password)) {
        return res.status(400).send({ status: false, msg: "please provide valid password" })
    }

    if(!address) {
        return res.status(400).send({ status: false, msg: "please provide address " })
    }
    if (!Validator.isValidRequestBody(address) ){
    return res.status(400).send({ status: false, msg: "please provide address in detail" })
    }

    if(!Validator.isValid(address)) {
        return res.status(400).send({ status: false, msg: "address cannot be empty" })
    }
    
    if (!address.street) {
        return res.status(400).send({ status: false, msg: "please provide street field." })
    }

    if(!Validator.isValid(address.street)) {
        return res.status(400).send({ status: false, msg: "address cannot be empty" })
    }

    if (!address.city) {
        return res.status(400).send({ status: false, msg: "please provide city field." })
    }

    if(!Validator.isValid(address.city)) {
        return res.status(400).send({ status: false, msg: "city cannot be empty" })
    }

    if (!address.pincode) {
        return res.status(400).send({ status: false, msg: "please provide pincode field." })
    }

    if(!Validator.isValid(address.pincode)) {
        return res.status(400).send({ status: false, msg: "pincode cannot be empty" })
    }

    if (!/^[1-9][0-9]{5}$/.test(address.pincode)) {
        return res.status(400).send({ status: false, msg: "please provide a 6 digit pincode" })
    }


    let saveData= await userModel.create(data)
    res.status(201).send({status:true, msg:"successfully created", data:saveData }) 
} catch(err) {
    console.log(err)
    res.status(500).send({status:false, msg: err.message})
}

}


const loginUser = async function (req, res) {
    try {
    let body = req.body
    if (Object.keys(body).length != 0) {
    let userName = req.body.email;
    let passwords = req.body.password; 
    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(userName))) { return res.status(400).send({ status: false, msg: "Please provide a valid email" }) }
    if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(passwords))) {
    return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
    }
    let user = await userModel.findOne({ email: userName});


    
    if (!user) {
    return res.status(400).send({
    status: false,msg: "email is not correct" });
    }

    if (user.password != passwords) {
        return res.status(400).send({status: false, msg: "password is not correct"})
    }
    
    let token = jwt.sign(
    {
     userId: user._id,
    email: user._email
    
    }, "bookprojectGroup19", { expiresIn: "5hrs" }
    
    );
    res.status(200).setHeader("x-api-key", token);
    return res.status(201).send({ status: "loggedin", token: token });
    }
    
    else { return res.status(400).send({ msg: "Bad Request" }) }
    
    }
    catch (err) {
    
    return res.status(500).send({ msg: err.message })
    }
    
    };
    
    


module.exports.createUser=createUser;
module.exports.loginUser=loginUser;
