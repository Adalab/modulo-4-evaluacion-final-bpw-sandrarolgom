const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
            message: "Se ha añadido un nuevo juego",
        });
    }; 
});
// 2. Create new user
server.post("/users", async (req, res)=>{
    const {username, email, password} = req.body;
    if(!username, !email, !password) {
        res.status(400).json({
            success:false,
            message:"Campo obligatorio: nombre"
        });
    } else {
        const conex = await getConnectionDB();
        const sql = "INSERT INTO users (username, email, password) VALUES (?,?,?);";
        const [result] = await conex.query(sql, [username, email, password]);
        conex.end();
        res.status(200).json({
            success:true,
            message:"Nuevo usuario añadido"
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
 server.get("/games_users", async (req, res)=>{
     const conex = await getConnectionDB();
     const sql = "SELECT users.username as users, GROUP_CONCAT(board_games.name SEPARATOR ', ') AS games FROM users INNER JOIN games_users ON users.idUser = games_users.idUser INNER JOIN board_games ON board_games.idBoardGame = games_users.idBoardGame GROUP BY users.idUser;"; // Returns two columns, one for users and another for games. The users are grouped, and the games are concatenated using GROUP_CONCAT
     const [resultGamesUsers] = await conex.query(sql);
     res.status(200).json({
        success: true,
        result:resultGamesUsers,
     });
 });

// --> PUT ENDPOINT <--

//1. Update from board_game table
server.put("/games/:id", async (req, res)=>{
    const id = req.params.id;
    const {name, category, min_Players, max_Players} = req.body;
    const conex = await getConnectionDB();
    const sql = "UPDATE board_games SET name=?, category=?, min_Players=?, max_Players=? WHERE idBoardGame=?;";
    const [resultUpdateGames] = await conex.query(sql, [name, category, min_Players, max_Players, id]);
    conex.end();
    res.status(200).json({
        success: true,
        message: "Actualizado con éxito"
    });
});

//2. Update from users table
server.put("/users/:id", async (req, res)=>{
    const id = req.params.id;
    const {username, email, password} = req.body;
    const conex = await getConnectionDB();
    const sql = "UPDATE users SET username=?, email=?, password=? WHERE idUser=?;";
    const [resultUpdateGames] = await conex.query(sql, [username, email, password, id]);
    conex.end();
    res.status(200).json({
        success: true,
        message: "Actualizado con éxito"
    });
});

// --> DELETE ENDPOINTS <--

// 1. Delete from games
server.delete("/games/:id", async (req, res)=>{
    const id = req.params.id;
    const conex = await getConnectionDB();
    const sql = "DELETE FROM board_games WHERE idBoardGame=?;";
    const [resultDeleteGame] = await conex.query(sql, [id]);
    conex.end();
    res.status(200).json({
        success: true,
        message: "Juego eliminado con éxito"
    });
});

// 2. Delete from users
server.delete("/users/:id", async (req, res)=>{
    const id = req.params.id;
    const conex = await getConnectionDB();
    const sql = "DELETE FROM users WHERE idUser=?;";
    const [resultDeleteUser] = await conex.query(sql, [id]);
    conex.end();
    res.status(200).json({
        success: true,
        message: "Usuario eliminado con éxito"
    });
});

//3. Delete from games_users
server.delete("/games_users/:idGame/:idUser", async (req, res)=>{
    const idGame = req.params.idGame;
    const idUser = req.params.idUser;
    const conex = await getConnectionDB();
    const sql = "DELETE FROM games_users WHERE idBoardGame = ? and idUser = ?;";
    const [resultDeleteRelation] = await conex.query(sql, [idGame, idUser]);
    conex.end();
    res.status(200).json({
        success: true,
        message: "Eliminado con éxito"
    });
});

// --> ENDPOINT SIGNUP <--
server.post("/register", async (req, res)=>{
    const {username, email, password} = req.body;
    const conex = await getConnectionDB();
    //autenticate email
    const sql = "SELECT * FROM users WHERE email = ?;";
    const [resultSearchEmail] = await conex.query(sql, [email]);
    //if not found this email...
    if(resultSearchEmail.length === 0){
        //const with password encriptada
        const passHashed = await bcrypt.hash(password, 10);
        const sqlInsert = "INSERT INTO users (username, email, password) VALUE (?,?,?);";
        const [resultSignup] = await conex.query(sqlInsert, [username, email, passHashed]);
        res.status(200).json({
            success: true,
            token: passHashed,
        })
    } else {
        res.status(200).json({
            success: false,
            error: "Email ya registrado",
        });
    };
    conex.end();
});