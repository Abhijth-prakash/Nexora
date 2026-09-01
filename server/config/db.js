const mongoose = require('mongoose')
const config = require('./config')


class MongoDBConnection {
    constructor(){
        this.url = config.MongoUrl
    }

    async connect (){
        try{
            await mongoose.connect(this.url)
            console.log('mongodb connected')
            
        }catch(err){
            console.log(err)
        }
    }
}

const mongodb = new MongoDBConnection

module.exports = mongodb
