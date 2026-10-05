

//user Routes
const authRoutes = require('./user/authRoutes')
const addressRoutes = require('./user/addressRoutes')

//admin Routes
const adminRoutes = require('./admin/adminRoutes')
const adminUserRoutes = require('./admin/adminUser')
const category = require('./admin/Category')
// const test = require('./admin/Test')

const setupRoutes = (app) => {
  //user
  app.use("/api/auth", authRoutes);
  app.use('/api/profile',addressRoutes)


  //admin 
  app.use("/api/admin",adminRoutes)
  app.use("/api/admin",adminUserRoutes)
  app.use("/api/admin",category)
  
 
};



module.exports = setupRoutes