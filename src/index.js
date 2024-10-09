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

//--> POST ENDPOINTS <--

// 1. Create new game
server.post("/games", async (req, res)=>{
    const {name, category, min_Players, max_Players} = req.body;
    if(!name || !category || !min_Players || !max_Players){ //hay que hacer la condicional porque las columnas tienen not null en la db y si no ponemos la condicional, la db rechaza la consulta
        res.status(400).json({
            success: false,
            message: "Campos obligatorios: name, category, min_Players, max_Players"
        });
    } else {
        const conex = await getConnectionDB();
        const sql = "INSERT INTO board_games (name, category, min_Players, max_Players) VALUES (?,?,?,?);";
        const [result] = await conex.query(sql, [name, category, min_Players, max_Players]);
        conex.end();
        res.status(200).json({
            success: true,
            result: "Se ha añadido un nuevo juego",
        });
    }; 
});
// 2. Create new user
server.post("/users", async (req, res)=>{
    const {username} = req.body;
    if(!username) {
        res.status(400).json({
            success:false,
            message:"Campo obligatorio: nombre"
        });
    } else {
        const conex = await getConnectionDB();
        const sql = "INSERT INTO users (username) VALUES (?);";
        const [result] = await conex.query(sql, [username]);
        conex.end();
        res.status(200).json({
            success:true,
            result:"Nuevo usuario añadido"
        });
    };
});
//3. Relation games_users
server.post("/games_users", async (req, res)=>{
    const {idBoardGame, idUser} = req.body;
    const conex = await getConnectionDB();
    const sql = "INSERT INTO games_users (idBoardGame, idUser) VALUES (?,?);";
    const [result] = await conex.query(sql, [idBoardGame, idUser]);
    conex.end();
    res.status(200).json({
        success:true,
    })
});
//--> GET ENDPOINTS <--

//1. Get games
server.get("/games", async (req, res)=>{
    const conex = await getConnectionDB();
    const sql = "SELECT * FROM board_games;";
    const [resultGames] = await conex.query(sql);
    conex.end();
    res.status(200).json({
        success: true,
        resultP: resultGames,
    });
});

//2. Get users
server.get("/users", async (req, res)=>{
    const conex = await getConnectionDB();
    const sql = "SELECT * FROM users";
    const [resultUsers] = await conex.query(sql);
    conex.end();
    res.status(200).json({
        success: true,
        result: resultUsers,
    });
})

//3. Get games_users
// server.get("/games_users", async (req, res)=>{
//     const conex = await getConnectionDB();
//     const 
// })