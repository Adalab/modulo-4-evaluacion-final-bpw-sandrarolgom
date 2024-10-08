CREATE DATABASE IF NOT EXISTS games;
USE games;
SELECT * FROM board_games;
CREATE TABLE board_games (
	idBoardGame INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    category VARCHAR (45) NOT NULL,
    min_Players INT NOT NULL,
    max_Players INT NOT NULL,
    status ENUM('comprado', 'lista de deseos') NOT NULL
);
SELECT * FROM users;
CREATE TABLE users (
	idUser INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(45)
);