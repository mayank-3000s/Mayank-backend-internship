const nodemailer = require('nodemailer');
const { user, pass } = require('../../env');
// const path = require('path');
// const fs = require('fs');
const passwordResetmail = require('../templates/passwordresetmail');

const passwordResetOTP = async(receiver, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    }) 

    const Emailoption = {
        from : user,
        to : receiver,
        subject: "password reset request",
        html: passwordResetmail(otp)
    }

    try{
        const response = await transporter.sendMail(Emailoption);
        console.log('Email send successfully');
        console.log(response);
    } catch(err) {
        console.log(err);  
        return err;      
    }
}   

module.exports = passwordResetOTP;