const jwt = require('jsonwebtoken');
const config = require('../config/authConfig');
const otpGenerator = require('otp-generator');
const db = require('../service/dbService');
const Admin = db.Admin;

exports.check = async (field, value) => {
    try {
        switch (field) {
            case 'email':
                return await db.Admin.findOne({
                    where: {
                        email: `${value}`
                    }
                });
            case 'userName':
                return await db.Admin.findOne({
                    where: {
                        userName: `${value}`
                    }
                });
            default:
                break;
        }
    } catch (error) {
        throw new Error(error);
    }
}
exports.verifyToken = async (token) => {
    try {
        let tokendata = jwt.verify(token, config.authSecret);
        // const pool = await poolPromise;
        // const result = await pool.request().query(`SELECT * FROM [dbo].[admin] WHERE email = '${tokendata._id}';`);   
    } catch (error) {
        console.log(error.message);
        return new Error(error.message);
        //throw new JsonWebTokenError(error.message);
        //res.status(400).send('Invalid token !');
    }
}

exports.generateAuthToken = async (id) => {
    return token = jwt.sign({
        _id: id
    }, config.authSecret, {
        expiresIn: '7 days'
    });
}

exports.numberFormatter = (value) => {
    return new Intl.NumberFormat().format(value);
}

exports.updateToken = async (table, id, data) => {
    try {
        console.log(table);
        table.update({
            token: data
        }, {
            where: {
                id: id
            }
        }).then(num => {
            if (num == 1) {
                console.log("Token was updated successfully.");
            } else {
                console.log(`Cannot update token for id = ${id}`);
            }
        }).catch(err => {
            throw new Error(err.message || `Error updating Admin with id= ${id}`);
        })
    } catch (error) {
        throw new Error(error)
    }
}

// options - optional
// digits - Default: true true value includes digits in OTP
// lowerCaseAlphabets - Default: true true value includes lowercase alphabets in OTP
// upperCaseAlphabets - Default: true true value includes uppercase alphabets in OTP
// specialChars - Default: true true value includes special Characters in OTP
exports.otpGenerator = () => {
    try {
        return otpGenerator.generate(6, {
            specialChars: false
        });
    } catch (error) {
        throw new Error(error);
    }
}

//module.exports = verifyToken;