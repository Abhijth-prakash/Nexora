
const userRoutes = require('./user/userRoutes')

const setupRoutes = (app) => {
  app.use("/api/auth", userRoutes);
 
};



module.exports = setupRoutes