const express = require("express");
const http = require('node:http')
require("dotenv").config();


class Server{
    constructor(){
        this.app = express()
        this.server = http.createServer(this.app)
        this.port = process.env.PORT
    }
    start(){
        this.server.listen(this.port,()=>{
            console.log(`server is running on http://localhost:${this.port}`)
        })
    }
}

const server = new Server()

server.start();