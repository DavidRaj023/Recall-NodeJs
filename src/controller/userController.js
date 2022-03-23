const db = require('../service/dbService');
const util = require('../utils/util');
const User = db.User;
const Room = db.Room;
const sendgrid = require('../utils/emailService');

let tempOTP = null;

exports.signup = async(req, res) => {
    try {
        if(!req.body) return res.send({
            message: 'Please fill the details'
        });
        
         //Validate email and name
        if((!req.body.email) || (!req.body.name)){
            return res.status(400).send({
            message: "Please fill the email / name field"
            })
        }

        const user = {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            address: req.body.address
        }

        if(!req.body.otp){
            //Generate OTP
            const otp = util.otpGenerator();
            tempOTP = otp;
            // const data = await User.findOne({ where: {email: `${req.body.email}`} });
            // console.log("Data: " + data);
            // if(data) return res.send({
            //     message: "Given email id is already used, please enter different email"
            // })
            //To Send mail
            sendgrid.sendMailSignUp(user, otp);
            return res.status(200).send({
                message:"Enter 6 digit secret code sent to your registered email"
            })
        }

        if(req.body.otp != tempOTP) return res.status(400).send("Wrong secret code");
        console.log(user);
        User.create(user).then(data => {
            return res.status(201).send({
                message: "Successfully Registered",
                id: data.id
            });
        }).catch(err =>{
            console.log(err);
            res.status(400).send({
                message: err.message || "Unable to create new user, please try again"
            });
        });  
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: error.message || "Unable to create new user, please try again"
        });    
    }
}

exports.signin = async(req, res) => {
    try {
        if(!req.body) return res.send({
            message: 'Please fill the details'
        });
        
         //Validate username and password
        if(!req.body.email){
            return res.status(400).send({
                message: "Please enter the email"
            })
        }

        if(!req.body.otp){
            const result = await User.findOne({ where: {email: `${req.body.email}`} });
            if(!result) throw new Error("This email id is not registered...")
            const user = result.dataValues;
            console.log(user);
            //Generate OTP
            const otp = util.otpGenerator();

            //Update OTP in db
            User.update({tempotp: otp}, {where: {id: user.id}})
            .then(num => {
                if(num ==1){
                    console.log('OTP updated successfully');
                    console.log(otp);
                }else{
                    console.log('Unable to update OTP');
                } 
            }).catch(err =>{
                throw new Error (err.message || `Error updating otp for email= ${user.email}`);
            })
            //To Send mail
            sendgrid.sendMail(user, otp);
            return res.status(200).send({
                message:"Enter 6 digit secret code sent to your registered email"
            })
        }

        const result = await User.findOne({ where: {email: `${req.body.email}`} });
        if(!result) throw new Error("This email id is not registered...");
        const user = result.dataValues;
        console.log(user);
        if(req.body.otp != user.tempotp) return res.status(400).send("Wrong secret code");

        const token = await util.generateAuthToken(user.email);
        util.updateToken(User, user.id, token);

        const awailableRooms = await Room.findAll({raw: true}, { where: {status: "Active"} });
        console.log();

        return res.status(200).send({
            message: "Successfully logged in",
            awailableRooms: awailableRooms,
            token: token
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).send({
            message: error.message || 'Unable'
        });    
    }
}