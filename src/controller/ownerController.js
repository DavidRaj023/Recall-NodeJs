const db = require('../service/dbService');
const bcrypt = require('bcryptjs');
// const constants = require('../utils/constant');
const util = require('../utils/util');
const sendgrid = require('../utils/emailService');
const Admin = db.Admin;
const Owner = db.Owner;

exports.create = async(req, res) => {
    try {
        if(!req.headers.authtoken) return res.send({
            message: 'Access Denied'
        })
        const tokenFromReq = req.headers.authtoken;
        console.log(req.user);
        const data = await Admin.findOne({ where: {email: `${req.user._id}`} });
        if(!data) throw new Error('Access Denied');
        if(tokenFromReq != data.token) throw new Error('Access Denied');
        
        if (!req.body) {
            return res.status(400),send({
                message: "Please fill the all the data"
            })
        }

        //Check email
        const checkEmail = await Owner.findOne({ where: {email: `${req.body.email}`} });
        console.log(checkEmail);
        if(checkEmail){
            throw new Error("Given email is already regsterd");
        }
        
        //Check userName
        const userName = await Owner.findOne({ where: {userName: `${req.body.userName}`} });
        if(userName){
            throw new Error("Given username is already regsterd");
        }

        //Pasword Hasing
        const password = await bcrypt.hash(req.body.password, 8);
        //Owner Details 
        const owner = {
            name: req.body.name,
            email: req.body.email,
            userName: req.body.userName,
            password: password
        }

        //Save Owner in DB
        Owner.create(owner).then(data => {
            return res.status(201).send({
                message: "Successfully Registered",
                id: data.id
            });
        }).catch(err =>{
            console.log(err);
            res.status(400).send({
                message: err.message || "Unable to create new admin, please try again"
            });
        });        
    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            message: error.message
        });        
    }
}

//Owner Login
exports.login = async(req, res) =>{
    try {
        if(!req.body) return res.send({
            message: 'Please fill the details'
        });
        
         //Validate username and password
        if((!req.body.userName) || (!req.body.password)){
            return res.status(400).send({
            message: "Please fill the username / password field"
            })
        }

        if(!req.body.otp){
            const result = await Owner.findOne({ where: {userName: `${req.body.userName}`} });
            const owner = result.dataValues;
            //Generate OTP
            const otp = util.otpGenerator();

            //Update OTP in db
            Owner.update({otp: otp}, {where: {userName: owner.userName}})
            .then(num => {
                if(num ==1){
                    console.log('OTP updated successfully');
                    console.log(otp);
                }else{
                    console.log('Unable to update OTP');
                } 
            }).catch(err =>{
                throw new Error (err.message || `Error updating otp for userName= ${owner.userName}`);
            })
            //To Send mail
            sendgrid.sendMail(owner, otp);
            return res.status(200).send({
                message:"Enter 6 digit secret code sent to your registered email"
            })
        }

        const result = await Owner.findOne({ where: {userName: `${req.body.userName}`} });
        const owner = result.dataValues;
        console.log(owner);
        if(req.body.otp != owner.otp) return res.status(400).send("Wrong secret code");

        const token = await util.generateAuthToken(owner.email);
        util.updateToken(Owner, owner.id, token);

        return res.status(200).send({
            message: "Successfully logged in",
            token: token
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            message: error.message || 'Unable'
        });    
    }

}

exports.logout = async(req, res) => {
    try {
      if (!req.body.userName) {
        return res.send({
          message: "Please enter the username."
        })
      }
      Owner.update({token: null}, {where: {userName: req.body.userName}})
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