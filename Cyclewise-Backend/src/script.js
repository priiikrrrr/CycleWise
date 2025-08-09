const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const configureApp = require("./settings/config.js");

process.env.NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({path : envFile});


const app = express();
const port = parseInt(process.env.PORT);
app.use(express.json());

//MIDDLE WARES 
configureApp(app);


async function bootstrap(){
    try{
        await mongoose.connect(process.env.DATABASE_URL,
            {dbName: process.env.DATABASE_NAME}
        );
    console.log("connected to db!");
        app.listen(port,()=>{
            console.log(`app is listening on port ${port}`);
        });
        
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}
bootstrap();