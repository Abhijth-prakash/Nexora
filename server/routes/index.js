
const authRoutes = require('./user/authRoutes')
const adminRoutes = require('./admin/adminRoutes')

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/admin",adminRoutes)
 
};



module.exports = setupRoutes