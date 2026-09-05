const config = require("../config/config");
const logger = require("./logger");
const nodemailer = require("nodemailer");

class EmailService {
  static getTransporter() {
    if (
      config.Nodemailer.EMAIL_host &&
      config.Nodemailer.EMAIL_user &&
      config.Nodemailer.EMAIL_password
    ) {
      return nodemailer.createTransport({
        host: config.Nodemailer.EMAIL_host,
        port: config.Nodemailer.EMAIL_port || 587,
        secure:
          config.Nodemailer.EMAIL_secure === true ||
          config.Nodemailer.EMAIL_secure === "true",
        auth: {
          user: config.Nodemailer.EMAIL_user,
          pass: config.Nodemailer.EMAIL_password,
        },
      });
    }

    return null;
  }

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static generateResetToken() {
    return require("crypto").randomBytes(32).toString("hex");
  }

  static async sendOTP(email, otp, name = "User") {
    try {
      const emailContent = {
        from:
          config.Nodemailer.EMAIL_from ||
          config.Nodemailer.EMAIL_user,

        to: email,

        subject: "Verify Your Email - Nexora",

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">
              Welcome to Nexora, ${name}!
            </h2>

            <p>
              Thank you for registering.
              Please verify your email address using the OTP below:
            </p>

            <div style="
              background-color: #f4f4f4;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            ">
              <h1 style="
                color: #007bff;
                font-size: 32px;
                margin: 0;
              ">
                ${otp}
              </h1>
            </div>

            <p>This OTP is valid for 10 minutes.</p>

            <p>
              If you didn't create an account,
              please ignore this email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 20px 0;
            ">

            <p style="
              color: #666;
              font-size: 12px;
            ">
              © ${new Date().getFullYear()} Nexora.
              All rights reserved.
            </p>
          </div>
        `,

        text: `
Welcome to Nexora, ${name}!

Your OTP is: ${otp}

This OTP is valid for 10 minutes.

If you didn't create an account, please ignore this email.
        `,
      };

      const transporter = this.getTransporter();

      if (transporter) {
        await transporter.sendMail(emailContent);

        logger.info(`OTP email sent to ${email}`);
      } else {
        logger.info(
          `[EMAIL SERVICE] OTP Email would be sent to ${email}:`,
          {
            otp,
            subject: emailContent.subject,
          }
        );

        console.log("\n=== EMAIL OTP (Development Mode) ===");
        console.log(`To: ${email}`);
        console.log(`Subject: ${emailContent.subject}`);
        console.log(`OTP: ${otp}`);
        console.log("=====================================\n");
      }

      return true;

    } catch (error) {
      logger.error("Error sending OTP email:", error);

      throw new Error("Failed to send OTP email");
    }
  }
}

module.exports = EmailService;