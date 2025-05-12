import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    host:"smtp.ethereal.email",
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD ,
    },
})