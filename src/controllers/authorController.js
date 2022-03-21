const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")

const isValid= function(value){
  if( typeof (value)=== 'undefined' || typeof (value)=== 'null'){
      return false
  } 
  if(value.trim().length==0){
      return false
  } if(typeof (value) === 'string' && value.trim().length >0 ){
      return true
  }
}

const createAuthor = async function (req, res) {
  try {
    const data = req.body
    if (!Object.keys(data).length > 0) return res.status(400).send({ error: "Please enter data" })

    //  checking if any data field is empty or has no value
    if( !isValid(data.password) )    return res.status(400).send({ status : false, msg: 'please provide password'})
    if( !isValid(data.fname) )    return res.status(400).send({ status : false, msg: 'please provide First Name'})    
    if( !isValid(data.email) )    return res.status(400).send({ status : false, msg: 'please provide email'})
    if( !isValid(data.lname) )    return res.status(400).send({ status : false, msg: 'please provide last Name'})    
    if( !isValid(data.title) )    return res.status(400).send({ status : false, msg: 'please provide title'})    
 
    const createdauthor = await authorModel.create(data)
    res.status(201).send({ data: createdauthor })
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}



const loginAuthor = async function (req, res) {
  try {
    let email = req.body.email;
    let password = req.body.password;

    // checking if email and password is missing in req body
    if (!email) return res.status(400).send({ error: " Please , enter email Id" })
    if (!password) return res.status(400).send({ error: " Please , enter password" })

    // checking if email and password has no value
    if (!isValid(email)) return res.status(400).send({ status: false, msg: 'please provide email' })
    if (!isValid(password)) return res.status(400).send({ status: false, msg: 'please provide password' })
    

    let author = await authorModel.findOne({ email: email, password: password });
    if (!author)
      return res.status(404).send({
        status: false,
        msg: "user not found",
    });

    let token = jwt.sign({ authorId: author._id.toString() }, "secuiretyKeyToCheckToken");
    res.setHeader("x-api-key", token);
    res.status(200).send({ status: "Author log-in successfully", data: token });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ msg: err.message })
  }
}

module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor