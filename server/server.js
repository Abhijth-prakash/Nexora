const express = require("express");
const http = require("node:http");
const cookieParser = require("cookie-parser");

const setupRoutes = require("./routes/index");
const mongodb = require("./config/db");
const config = require("./config/config");
const logger = require("./utils/logger");
const cors = require("cors");
const { errorHandler,notFound } = require("./middilewares/errorHandler");



class Server {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.port = config.PORT;
  }

  initialize() {
    this.app.use(express.json());

    
    this.app.use(cookieParser());

      this.app.use(
      cors({
        origin: config.CORS.ORIGIN,
        credentials: config.CORS.CREDENTIALS,
        methods: config.CORS.METHODS,
        allowedHeaders: config.CORS.ALLOWED_HEADERS,
      })
    );
        setupRoutes(this.app);
       this.app.use(notFound);
      this.app.use(errorHandler);


  }

  async start() {
    await mongodb.connect();
    this.initialize();

    this.server.listen(this.port, () => {
      logger.info(
        `server is running on http://localhost:${this.port}`
      );
    });
  }
}

const server = new Server();

server.start();