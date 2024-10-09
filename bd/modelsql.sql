-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema games
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema games
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `games` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `games` ;

-- -----------------------------------------------------
-- Table `games`.`board_games`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `games`.`board_games` (
  `idBoardGame` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `category` VARCHAR(45) NOT NULL,
  `min_Players` INT NOT NULL,
  `max_Players` INT NOT NULL,
  `status` ENUM('comprado', 'lista de deseos') NOT NULL,
  PRIMARY KEY (`idBoardGame`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `games`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `games`.`users` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `games`.`games_users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `games`.`games_users` (
  `idBoardGame` INT NOT NULL,
  `idUser` INT NOT NULL,
  PRIMARY KEY (`idBoardGame`, `idUser`),
  CONSTRAINT `fk_board_games_has_users_board_games`
    FOREIGN KEY (`idBoardGame`)
    REFERENCES `games`.`board_games` (`idBoardGame`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_board_games_has_users_users1`
    FOREIGN KEY (`idUser`)
    REFERENCES `games`.`users` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_board_games_has_users_users1_idx` ON `games`.`games_users` (`idUser` ASC) VISIBLE;

CREATE INDEX `fk_board_games_has_users_board_games_idx` ON `games`.`games_users` (`idBoardGame` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
