import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Request, Response } from "express";
import { generateOTP } from "../utils/authUtil";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "sfiav8.profile@gmail.com",
        pass: "xwdwlrgriraifzqo"
    }
});

const mailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "SFIAv8 Competency Profile System",
        link: 'https://mailgen.js/'
    }
})

export const registerMail =async (req: Request, res: Response) => {
    const { email, text, subject } = req.body;

    var userEmail = {
        body: {
            name: email,
            info: text || 'Welcome to Daily Tution! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to email, we\'d loveto help.'
        }
    }

    var emailBody = mailGenerator.generate(userEmail)

    let message = { 
        from : 'sfiav8.profile@gmail.com',
        to: email,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    //send mail
    transporter.sendMail(message)
        .then(()=> {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send( {error} ))
        
}

exports.generateOTPHandler = async (req, res) => {
    try {
      const email = req.query.email; // อ่านค่า email จาก query parameter
      const OTP = generateOTP();
      req.app.locals.OTP = OTP;
  
      // ส่งอีเมล
      const mailOptions = {
        from: 'sfiav8.profile@gmail.com',
        to: email, // อีเมลที่ระบุในฟอร์ม
        subject: 'Password Reset OTP',
        text: `Your OTP is: ${OTP}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({
            success: false,
            message: 'Failed to send OTP email. An internal server error occurred.'
          });
        } else {
          console.log('Email sent: ' + info.response);
          res.status(201).json({ code: OTP });
        }
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate OTP. An internal server error occurred.'
      });
    }
  };