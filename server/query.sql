CREATE TABLE `walkgps`.`user` (
  `usercode` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `status` INT NOT NULL COMMENT '0. 상태없음, 1. 기록중, 2. 처리중',
  PRIMARY KEY (`usercode`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `walkgps`.`record` (
  `recordcode` INT NOT NULL AUTO_INCREMENT,
  `usercode` INT NOT NULL,
  `starttime` DATETIME NOT NULL,
  `endtime` DATETIME NULL,
  `status` INT NOT NULL COMMENT '0. 기록중, 1. 기로완료, 2. 기록에러',
  PRIMARY KEY (`recordcode`),
  CONSTRAINT `user_code_fk`
    FOREIGN KEY (`usercode`)
    REFERENCES `walkgps`.`user` (`usercode`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `walkgps`.`cooord_line` (
  `recordcode` INT NOT NULL,
  `counter` INT NOT NULL,
  `from_latitude` FLOAT NOT NULL,
  `from_longitude` FLOAT NOT NULL,
  `to_latitude` FLOAT NOT NULL,
  `to_longitude` FLOAT NOT NULL,
  `time` VARCHAR(20) NULL,
  PRIMARY KEY (`recordcode`, `counter`),
  CONSTRAINT `recode_fk`
    FOREIGN KEY (`recordcode`)
    REFERENCES `walkgps`.`record` (`recordcode`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `walkgps`.`area` (
  `areacode` INT NOT NULL AUTO_INCREMENT,
  `latitude` FLOAT NOT NULL,
  `longitude` FLOAT NOT NULL,
  `description` VARCHAR(45) NULL,
  `size` INT NOT NULL,
  PRIMARY KEY (`areacode`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE `walkgps`.`userarea` (
  `areacode` INT NOT NULL,
  `usercode` INT NOT NULL,
  `lat_idx` INT NOT NULL,
  `counter` VARCHAR(100) NULL,
  PRIMARY KEY (`areacode`, `lat_idx`, `usercode`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;