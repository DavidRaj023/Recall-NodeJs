const db = require('../service/dbService');
const bcrypt = require('bcryptjs');
// const constants = require('../utils/constant');
const util = require('../utils/util');
const Admin = db.Admin;

//Create new Admin
exports.create = async(req, res) => {
  try {
    //Validate Body
    if(!req.body){
      return res.status(400).send({
        message: "Request cannot be empty.. Please fill the required field"
      })
    }
    
    //Validate username and password
    if((!req.body.userName) || (!req.body.password)){
      return res.status(400).send({
        message: "Please fill the username / password field"
      })
    }
    
    //Check email and User name
    const email = await util.check('email', req.body.email);
    if(email){
      throw new Error("Given email is already regsterd");
    }

    const userName = await util.check('userName', req.body.userName);
    if(userName){
      throw new Error("Given username is already regsterd");
    }

    //Pasword Hasing
    const password = await bcrypt.hash(req.body.password, 8);
    //Admin Details 
    const admin = {
      name: req.body.name,
      email: req.body.email,
      userName: req.body.userName,
      password: password
    }

    //Save Admin details to DB
    Admin.create(admin).then(data => {
      return res.status(201).send({
        message: "Successfully Registered",
        id: data.id
      });
    }).catch(err => {
      console.log(err);
      res.status(400).send({
        message: err.message || "Unable to create new admin, please try again"
      });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: err.message || "Something went wrong while create a new admin"
    })
  }
}

exports.login = async(req, res) =>{
  try {
     //Validate username and password
    if((!req.body.userName) || (!req.body.password)){
      return res.status(400).send({
        message: "Please fill the username / password field"
      })
    }
    // const admin = req.body;
    const userNameList = await util.check('userName', req.body.userName);
    if (userNameList == null) {
      console.log('Invalid Email ID or Password!');
      return res.status(400).send('Invalid Email ID or Password!');
    }
    //const adminDetails = userNameList.dataValues;
    const password = await bcrypt.compare(req.body.password, userNameList.dataValues.password);
    if(!password){
      console.log('Invalid Email ID or Password!');
      return res.status(400).send('Invalid Email ID or Password!');
    }

    //Create token and store into admin table
    const token = await util.generateAuthToken(userNameList.dataValues.email);
    util.updateToken(Admin, userNameList.dataValues.id, token);
    
    return res.status(200).send({
      "message": `Welcome ${userNameList.dataValues.name} `,
      "token": token
    });

  } catch (error) {
    console.log(err);
    res.status(400).send({
      message: err.message || "Something went wrong while login"
    })    
  }
}

//logout
exports.logout = async(req, res) => {
  try {
    if (!req.body.userName) {
      return res.send({
        message: "Please enter the username."
      })
    }
    Admin.update({token: null}, {where: {userName: req.body.userName}})
    .then(num =>{
      if(num == 1) return res.send({
        message: "logged off successfully"
      })
      else return res.send({
        message: "Unnable to log off.."
      })
      }).catch(err =>{
          throw new Error (err.message);
      })
  } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
  }
}
