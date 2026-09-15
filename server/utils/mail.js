const config = require("../config/config");
const logger = require("./logger");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

class Mail {

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
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  }

  static generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
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
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
          ">

            <h2 style="color: #333;">
              Welcome to Nexora, ${name}!
            </h2>

            <p>
              Thank you for registering.
              Please verify your email address
              using the OTP below:
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

            <p>
              This OTP is valid for 10 minutes.
            </p>

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

        logger.info(
          `OTP email sent to ${email}`
        );

      } else {

        logger.info(
          `[EMAIL SERVICE] OTP Email would be sent to ${email}:`,
          {
            otp,
            subject: emailContent.subject,
          }
        );

        console.log(
          "\n=== EMAIL OTP (Development Mode) ==="
        );

        console.log(`To: ${email}`);
        console.log(
          `Subject: ${emailContent.subject}`
        );
        console.log(`OTP: ${otp}`);

        console.log(
          "=====================================\n"
        );
      }

      return true;

    } catch (error) {

      logger.error(
        "Error sending OTP email:",
        error
      );

      throw new Error(
        "Failed to send OTP email"
      );
    }
  }

  // ------------------------------------------
  // RESET PASSWORD EMAIL
  // ------------------------------------------

  static async sendResetPasswordEmail(
    email,
    resetToken,
    name 
  ) {
    try {

      const resetUrl =
        `${config.FRONTEND_URL}/auth/resetpass?token=${resetToken}`;

      const emailContent = {

        from:
          config.Nodemailer.EMAIL_from ||
          config.Nodemailer.EMAIL_user,

        to: email,

        subject: "Reset Your Nexora Password",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          ">

            <h2 style="
              color: #222;
              margin-bottom: 10px;
            ">
              Reset Your Nexora Password
            </h2>

            <p>
              Hi ${name},
            </p>

            <p>
              We received a request to reset the
              password for your Nexora account.
            </p>

            <p>
              Click the button below to create
              a new password:
            </p>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 28px;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                "
              >
                Reset My Password
              </a>

            </div>

            <p>
              This password reset link is valid
              for <strong>10 minutes</strong>.
            </p>

            <p>
              If you didn't request a password reset,
              you can safely ignore this email.
              Your password will remain unchanged.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 30px 0;
            ">

            <p style="
              color: #666;
              font-size: 12px;
              line-height: 1.5;
            ">
              If the button doesn't work, copy and
              paste the following link into your browser:
            </p>

            <p style="
              color: #007bff;
              font-size: 12px;
              word-break: break-all;
            ">
              ${resetUrl}
            </p>

            <p style="
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            ">
              © ${new Date().getFullYear()} Nexora.
              All rights reserved.
            </p>

          </div>
        `,

        text: `
Hi ${name},

We received a request to reset the password
for your Nexora account.

Reset your password using the link below:

${resetUrl}

This password reset link is valid for 10 minutes.

If you didn't request a password reset,
you can safely ignore this email.
Your password will remain unchanged.

© ${new Date().getFullYear()} Nexora.
All rights reserved.
        `,
      };

      const transporter = this.getTransporter();

      if (transporter) {

        await transporter.sendMail(emailContent);

        logger.info(
          `Password reset email sent to ${email}`
        );

      } else {

        logger.info(
          `[EMAIL SERVICE] Password reset email would be sent to ${email}`,
          {
            resetUrl,
            subject: emailContent.subject,
          }
        );

        console.log(
          "\n=== PASSWORD RESET EMAIL (Development Mode) ==="
        );

        console.log(`To: ${email}`);
        console.log(
          `Subject: ${emailContent.subject}`
        );
        console.log(
          `Reset URL: ${resetUrl}`
        );

        console.log(
          "===============================================\n"
        );
      }

      return true;

    } catch (error) {

      logger.error(
        "Error sending password reset email:",
        error
      );

      throw new Error(
        "Failed to send password reset email"
      );
    }
  }

  static async AdminPasswordResetEmail(
    email,
    resetToken,
    name 
  ) {
    try {

      const resetUrl =
        `${config.ADMIN_URL}/resetpassword?token=${resetToken}`;

      const emailContent = {

        from:
          config.Nodemailer.EMAIL_from ||
          config.Nodemailer.EMAIL_user,

        to: email,

        subject: "Reset Your Nexora Password",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          ">

            <h2 style="
              color: #222;
              margin-bottom: 10px;
            ">
              Reset Your Nexora Password
            </h2>

            <p>
              Hi ${name},
            </p>

            <p>
              We received a request to reset the
              password for your Nexora account.
            </p>

            <p>
              Click the button below to create
              a new password:
            </p>

            <div style="
              text-align: center;
              margin: 30px 0;
            ">

              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 14px 28px;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                "
              >
                Reset My Password
              </a>

            </div>

            <p>
              This password reset link is valid
              for <strong>10 minutes</strong>.
            </p>

            <p>
              If you didn't request a password reset,
              you can safely ignore this email.
              Your password will remain unchanged.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 30px 0;
            ">

            <p style="
              color: #666;
              font-size: 12px;
              line-height: 1.5;
            ">
              If the button doesn't work, copy and
              paste the following link into your browser:
            </p>

            <p style="
              color: #007bff;
              font-size: 12px;
              word-break: break-all;
            ">
              ${resetUrl}
            </p>

            <p style="
              color: #666;
              font-size: 12px;
              margin-top: 30px;
            ">
              © ${new Date().getFullYear()} Nexora.
              All rights reserved.
            </p>

          </div>
        `,

        text: `
Hi ${name},

We received a request to reset the password
for your Nexora account.

Reset your password using the link below:

${resetUrl}

This password reset link is valid for 10 minutes.

If you didn't request a password reset,
you can safely ignore this email.
Your password will remain unchanged.

© ${new Date().getFullYear()} Nexora.
All rights reserved.
        `,
      };

      const transporter = this.getTransporter();

      if (transporter) {

        await transporter.sendMail(emailContent);

        logger.info(
          `Password reset email sent to ${email}`
        );

      } else {

        logger.info(
          `[EMAIL SERVICE] Password reset email would be sent to ${email}`,
          {
            resetUrl,
            subject: emailContent.subject,
          }
        );

        console.log(
          "\n=== PASSWORD RESET EMAIL (Development Mode) ==="
        );

        console.log(`To: ${email}`);
        console.log(
          `Subject: ${emailContent.subject}`
        );
        console.log(
          `Reset URL: ${resetUrl}`
        );

        console.log(
          "===============================================\n"
        );
      }

      return true;

    } catch (error) {

      logger.error(
        "Error sending password reset email:",
        error
      );

      throw new Error(
        "Failed to send password reset email"
      );
    }
  }
}

module.exports = Mail;

