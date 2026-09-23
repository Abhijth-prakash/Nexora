

//user Routes
const authRoutes = require('./user/authRoutes')
const addressRoutes = require('./user/addressRoutes')

//admin Routes
const adminRoutes = require('./admin/adminRoutes')
const adminUserRoutes = require('./admin/adminUser')

const setupRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use('/api/profile',addressRoutes)

  app.use("/api/admin",adminRoutes)
  app.use("/api/admin",adminUserRoutes)
 
};



module.exports = setupRoutes