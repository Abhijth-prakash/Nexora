require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MongoUrl: process.env.MongoUrl,

  Nodemailer: {
    EMAIL_password: process.env.EMAIL_password,
    EMAIL_host: process.env.EMAIL_host,
    EMAIL_port: process.env.EMAIL_port,
    EMAIL_user: process.env.EMAIL_user,
    EMAIL_secure: process.env.EMAIL_secure,
    EMAIL_from: process.env.EMAIL_from,
  },
};