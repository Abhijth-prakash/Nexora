
const userRoutes = require('./user/user')

const setupRoutes = (app) => {
  app.use("/api/auth", userRoutes);
 
};



module.exports = setupRoutes