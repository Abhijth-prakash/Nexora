
const authRoutes = require('./user/authRoutes')
const adminRoutes = require('./admin/adminRoutes')
const addressRoutes = require('./user/addressRoutes')

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/admin",adminRoutes)
  app.use('/api/profile',addressRoutes)
 
};



module.exports = setupRoutes