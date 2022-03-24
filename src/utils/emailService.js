require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const sendGridAPI = process.env.SENDGRID_API_KEY;


//SMTP
const sendMail = async (user, otp) => {
    try {
        console.log("From Email Service file");
        sgMail.setApiKey(sendGridAPI);
        sgMail.send({
            to: user.email,
            from: 'benjamindavid023@gmail.com',
            subject: 'Mail From OYO2 Teams ',
            html: `<h3>Hi ${user.name}, </h3>` + `<p>This is your secret code: ${otp} </p>`
        });
        console.log(`Link sent to this Email ${user.email}, OTP: ${otp}`);
    } catch (error) {
        console.log(error);
    }
}

//SMTP
const sendMailSignUp = async (user, otp) => {
    try {
        console.log("From Email Service file");
        sgMail.setApiKey(sendGridAPI);
        sgMail.send({
            to: user.email,
            from: 'benjamindavid023@gmail.com',
            subject: 'Mail From OYO2 Teams ',
            html: `<h3>Hi ${user.name}, </h3>` + `<p>This is your secret code: ${otp} for signup</p>`
        });
        console.log(`Link sent to this Email ${user.email}, OTP: ${otp}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendMail,
    sendMailSignUp
}