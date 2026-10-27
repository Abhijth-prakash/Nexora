

//user Routes
const authRoutes = require('./user/authRoutes')
const addressRoutes = require('./user/addressRoutes')
const productRoutes = require('./user/ProductRoutes')
const cartRoutes = require('./user/CartRoutes')
const orderRoutes = require('./user/orderRoutes')

//admin Routes
const adminRoutes = require('./admin/adminRoutes')
const adminUserRoutes = require('./admin/adminUser')
const category = require('./admin/Category')
const products = require('./admin/Products')
const coupons = require('./admin/Coupons')

const test = require('./admin/Test')

const setupRoutes = (app) => {

  
  //user
  app.use("/api/auth", authRoutes);
  app.use('/api/profile',addressRoutes)
  app.use('/api/users',productRoutes)
  app.use('/api/users',cartRoutes)
  app.use('/api/users',orderRoutes)

  //test
  app.use('/api/test',test)


  //admin 
  app.use("/api/admin",adminRoutes)
  app.use("/api/admin",adminUserRoutes)
  app.use("/api/admin",category)
  app.use("/api/admin",products)
  app.use("/api/admin",coupons)
  
 
};



module.exports = setupRoutes