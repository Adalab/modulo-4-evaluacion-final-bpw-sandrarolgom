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
