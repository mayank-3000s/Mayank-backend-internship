const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const otpEmailSender = require('../templates/otp');


const SendEmail = async(user, otp)=> {

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mayank.kne11@gmail.com",
        pass: 'ophwucgytzygqxxi'
    }
});

    // const htmlpath = path.join(__dirname, "../templates/opt.html");
    // const htmlContent = fs.readFileSync(htmlpath, 'utf-8');

    const mailoption = {
        from : "mayank.kne11@gmail.com",
        to: user,
        subject: "Email verification",
        html: otpEmailSender(otp)
    }

    try{
        const response = await transporter.sendMail(mailoption);
        console.log('Email sent successfully');
        console.log(response);
        
    } catch(err){
        console.log(err);
        return err;
    }
}

module.exports = SendEmail;