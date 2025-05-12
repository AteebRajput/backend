export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .welcome-message {
            font-size: 18px;
            line-height: 1.6;
            color: #333;
        }
        .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to AgriHub!</h1>
        </div>
        <div class="content">
            <div class="welcome-message">
                <p>Dear {name},</p>
                <p>Welcome to AgriHub! We're thrilled to have you join our community.</p>
                <p>With your account, you can:</p>
                <ul>
                    <li>Connect with farmers and buyers</li>
                    <li>Access agricultural resources</li>
                    <li>Participate in our marketplace</li>
                    <li>Stay updated with latest agricultural trends</li>
                </ul>
                <p>If you have any questions, our support team is always here to help!</p>
                <p>Best regards,<br>The AgriHub Team</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2024 AgriHub. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const AUCTION_CREATED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Auction Created</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Your Auction is Live!</h1>
  </div>

  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi {name},</p>
    <p>Your product auction has been successfully created on <strong>AgriHub</strong>. Here are the details of your listing:</p>

    <h3 style="color: #4CAF50;">📦 Product Information:</h3>
    <ul style="padding-left: 20px;">
      <li><strong>Name:</strong> {productName}</li>
      <li><strong>Category:</strong> {category}</li>
      <li><strong>Quantity:</strong> {quantity} {unit}</li>
      <li><strong>Base Price:</strong> Rs. {basePrice}</li>
      <li><strong>Quality:</strong> {quality}</li>
      <li><strong>Harvest Date:</strong> {harvestDate}</li>
      <li><strong>Expiry Date:</strong> {expiryDate}</li>
      <li><strong>Location:</strong> {location}</li>
    </ul>

    <h3 style="color: #4CAF50;">⏱ Auction Details:</h3>
    <ul style="padding-left: 20px;">
      <li><strong>Status:</strong> Active</li>
      <li><strong>Auction Ends On:</strong> {bidEndTime}</li>
    </ul>


    <p>Good luck with your auction! If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The AgriHub Team</p>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;

export const AUCTION_SOLD_OWNER_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auction Sold</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width:600px; margin:0 auto; padding:20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Auction Sold!</h1>
  </div>
  <div style="background:#f9f9f9; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi {ownerName},</p>
    <p>Congratulations! Your product <strong>{productName}</strong> has been sold successfully.</p>
    
    <h3 style="color: #4CAF50;">Sale Details:</h3>
    <ul>
      <li><strong>Sold To:</strong> {winnerName}</li>
      <li><strong>Final Price:</strong> Rs. {finalPrice}</li>
    </ul>

    <h3 style="color: #4CAF50;">Winner Contact:</h3>
    <ul>
      <li><strong>Email:</strong> {winnerEmail}</li>
      <li><strong>Phone:</strong> {winnerPhone}</li>
    </ul>

    <p>Please get in touch with the buyer to finalize the transaction and delivery.</p>
    <p>Best regards,<br>The AgriHub Team</p>
  </div>

  <div style="text-align:center; margin-top:20px; color:#888; font-size:0.8em;">
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;


export const AUCTION_WON_WINNER_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You Won the Auction!</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width:600px; margin:0 auto; padding:20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding:20px; text-align:center;">
    <h1 style="color:white; margin:0;">Congratulations!</h1>
  </div>
  <div style="background:#f9f9f9; padding:20px; border-radius:0 0 5px 5px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
    <p>Hi {winnerName},</p>
    <p>Great news! You have won the auction for <strong>{productName}</strong>.</p>

    <h3 style="color: #4CAF50;">Purchase Details:</h3>
    <ul>
      <li><strong>Product:</strong> {productName}</li>
      <li><strong>Winning Bid:</strong> Rs. {finalPrice}</li>
    </ul>

    <h3 style="color: #4CAF50;">Seller Contact:</h3>
    <ul>
      <li><strong>Name:</strong> {ownerName}</li>
      <li><strong>Email:</strong> {ownerEmail}</li>
      <li><strong>Phone:</strong> {ownerPhone}</li>
    </ul>

    <p>Please reach out to the seller to arrange payment and delivery details.</p>
    <p>Thank you for using AgriHub!</p>
    <p>Best regards,<br>The AgriHub Team</p>
  </div>

  <div style="text-align:center; margin-top:20px; color:#888; font-size:0.8em;">
    <p>This is an automated message. Please do not reply.</p>
  </div>
</body>
</html>
`;

export const NEW_BID_OWNER_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <title>New Bid Received - {productName}</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
  <h2>Hi {ownerName},</h2>

  <p>Good news! Someone has placed a bid on your product <strong>{productName}</strong>!</p>

  <h3>Bid Details:</h3>
  <ul>
    <li><strong>Bidder Name:</strong> {bidderName}</li>
    <li><strong>Bidder Email:</strong> {bidderEmail}</li>
    <li><strong>Bidder Phone:</strong> {bidderPhone}</li>
    <li><strong>Bidder Location:</strong> {bidderLocation}</li>
    <li><strong>Bid Amount:</strong> Rs {bidAmount}</li>
  </ul>

  <p>Keep an eye on your auction to see how the bidding progresses! 👀</p>

  <br>
  <p>Thanks for using <strong>AgriHub</strong>! 🌾</p>
</body>
</html>
`