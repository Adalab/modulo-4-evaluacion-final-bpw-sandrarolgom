const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

require("dotenv").config();

const server = express();
server.use(cors());
server.use(express.json({limit:"50mb"}));

const port = process.env.PORT;
server.listen(port, ()=>{
    console.log(`Server is running in http://localhost:${port}`);
})

//CONNECTION TO DATABASE
async function getConnectionDB(){
    const conex = await mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DATABASE
    });
    conex.connect();
    return conex;
};