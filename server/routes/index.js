
const authRoutes = require('./user/authRoutes')

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
 
};



module.exports = setupRoutes