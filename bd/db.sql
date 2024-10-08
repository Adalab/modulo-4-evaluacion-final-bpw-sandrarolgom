CREATE DATABASE IF NOT EXISTS games;
USE games;
CREATE TABLE board_games (
	idBoardGame INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) NOT NULL,
    category VARCHAR (45) NOT NULL,
    min_Players INT NOT NULL,
    max_Players INT NOT NULL,
    status ENUM('comprado', 'lista de deseos') NOT NULL
);
SELECT * FROM board_games;