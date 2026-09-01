const mongoose = require('mongoose')
const config = require('./config')
const logger = require('../utils/logger')




class MongoDBConnection {
    constructor(){
        this.isConnected = false
        this.listeners()
    }

listeners() {
    mongoose.connection.on("error", (err) => {
        logger.error("MongoDB connection error", err);
        this.isConnected = false;
    });

    mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
        this.isConnected = false;
    });

    mongoose.connection.on("reconnected", () => {
        logger.info("MongoDB reconnected");
        this.isConnected = true;
    });
}

  async connect() {
    try {
      if (this.isConnected) {
        logger.info("Database already connected");
        return;
      }

      await mongoose.connect(config.MongoUrl);
      this.isConnected = true;
      logger.info("MongoDB connected successfully");

    } catch (error) {
      logger.error("MongoDB connection failed:", error);
      process.exit(1);
    }
  }
  async disconnect() {
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info("MongoDB disconnected gracefully");
    } catch (error) {
      logger.error("Error during MongoDB disconnect", error);
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
    };
  }


}



const mongodb = new MongoDBConnection

module.exports = mongodb
