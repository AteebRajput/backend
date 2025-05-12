import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE,
     AUCTION_CREATED_TEMPLATE, AUCTION_SOLD_OWNER_TEMPLATE,AUCTION_WON_WINNER_TEMPLATE, NEW_BID_OWNER_TEMPLATE } from "./emailTemplates.js";

dotenv.config();

// Validate environment variables
if (!process.env.USER || !process.env.PASSWORD) {
    throw new Error("Gmail credentials are missing in the environment variables.");
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter error:", error);
    } else {
        console.log("Transporter ready to send emails:", success);
    }
});

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        if (!email || !verificationToken) {
            return { success: false, error: "Email and verification token are required" };
        }

        const mailOptions = {
            from: `"AgriHub" <${process.env.USER}>`,
            to: email,
            subject: "Verify Your Email - AgriHub",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error: error.message };
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        if (!email || !name) {
            return { success: false, error: "Email and name are required" };
        }

        const mailOptions = {
            from: `"AgriHub" <${process.env.USER}>`,
            to: email,
            subject: "Welcome to AgriHub!",
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}", name)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", info.messageId);

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return { success: false, error: error.message };
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        if (!email || !resetURL) {
            throw new Error("Email and reset URL are required");
        }

        const mailOptions = {
            from: `"AgriHub" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: "Reset Your Password - AgriHub",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL), // Fixed the replacement
            category: "PASSWORD RESET"
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
        
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending reset email:", error);
        return { success: false, error: error.message };
    }
};

export const sendResetSuccessfullEmail = async (email) =>{
    try {
        const mailOptions = {
            to:email,
            from: `"AgriHub" <${process.env.GMAIL_USER}>`,
            subject:"Passwors Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
    } catch (error) {

    }
}

export const sendAuctionCreatedEmail = async (email, data) => {
    try {
      const html = AUCTION_CREATED_TEMPLATE
        .replace("{name}", data.name)
        .replace("{productName}", data.productName)
        .replace("{category}", data.category)
        .replace("{quantity}", data.quantity)
        .replace("{unit}", data.unit)
        .replace("{basePrice}", data.basePrice)
        .replace("{quality}", data.quality)
        .replace("{harvestDate}", data.harvestDate)
        .replace("{expiryDate}", data.expiryDate)
        .replace("{location}", data.location)
        .replace("{bidEndTime}", data.bidEndTime)
        .replace("{productURL}", data.productURL);
  
      const mailOptions = {
        to: email,
        from: `"AgriHub" <${process.env.GMAIL_USER}>`,
        subject: "Auction Created Successfully",
        html: html,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Auction creation email sent:", info.messageId);
    } catch (error) {
      console.error("Failed to send auction email:", error);
    }
  };
  
  export const sendAuctionEndEmaiToOwner = async (email, data) => { 
    try {
      const htmlContent = AUCTION_SOLD_OWNER_TEMPLATE
        .replace("{ownerName}", data.ownerName)
        .replace("{productName}", data.productName)
        .replace("{finalPrice}", data.bidAmount)
        .replace("{winnerName}", data.winnerName)
        .replace("{winnerEmail}", data.winnerEmail)
        .replace("{winnerPhone}", data.winnerPhone)
        .replace("{winnerLocation}", data.winnerLocation);
  
      const mailOptions = {
        to: email,
        from: `"AgriHub" <${process.env.GMAIL_USER}>`,
        subject: "Auction Ended - Your Product is Sold!",
        html: htmlContent,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Auction end email sent:", info.messageId);
    } catch (error) {
      console.error("Failed to send auction end email:", error);
    }
  };
  
  export const sendAuctionWinEmailToWinner = async (email, data) => { 
    try {
      const htmlContent = AUCTION_WON_WINNER_TEMPLATE
        .replace("{winnerName}", data.winnerName)
        .replace("{productName}", data.productName)
        .replace("{finalPrice}", data.bidAmount)
        .replace("{ownerName}", data.ownerName)
        .replace("{ownerEmail}", data.ownerEmail)
        .replace("{ownerPhone}", data.ownerPhone)
        .replace("{ownerLocation}", data.ownerLocation);
  
      const mailOptions = {
        to: email,
        from: `"AgriHub" <${process.env.GMAIL_USER}>`,
        subject: "Congratulations! You Won an Auction 🎉",
        html: htmlContent,
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("Auction win email sent:", info.messageId);
    } catch (error) {
      console.error("Failed to send auction win email:", error);
    }
  };
  
  export const sendNewBidEmailToOwner = async (email, data) => { 
    try {
      const mailOptions = {
        to: email,
        from: `"AgriHub" <${process.env.GMAIL_USER}>`,
        subject: `New Bid on Your Product: ${data.productName}`,
        html: NEW_BID_OWNER_TEMPLATE
          .replace("{ownerName}", data.ownerName)
          .replace("{productName}", data.productName)
          .replace("{bidderName}", data.bidderName)
          .replace("{bidderEmail}", data.bidderEmail)
          .replace("{bidderPhone}", data.bidderPhone)
          .replace("{bidderLocation}", data.bidderLocation)
          .replace("{bidAmount}", data.bidAmount)
      };
  
      const info = await transporter.sendMail(mailOptions);
      console.log("New bid email sent to owner:", info.messageId);
    } catch (error) {
      console.error("Failed to send new bid email to owner:", error);
    }
  }
  