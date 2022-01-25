CREATE TABLE `walkhistory`.`user` (
  `user_code` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(45) NOT NULL,
  `user_pw` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `state` INT NOT NULL DEFAULT 0,
  `open` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`user_code`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC) VISIBLE);

  CREATE TABLE `walkhistory`.`record` (
  `record_code` INT NOT NULL AUTO_INCREMENT,
  `record_name` VARCHAR(45) NOT NULL,
  `state` INT NOT NULL DEFAULT 0,
  `user_code` INT NOT NULL,
  PRIMARY KEY (`record_code`),
  INDEX `user_record_fk_idx` (`user_code` ASC) VISIBLE,
  CONSTRAINT `user_record_fk`
    FOREIGN KEY (`user_code`)
    REFERENCES `walkhistory`.`user` (`user_code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `walkhistory`.`friend` (
  `user_code` INT NOT NULL,
  `friend_code` INT NOT NULL,
  PRIMARY KEY (`user_code`, `friend_code`),
  INDEX `friend_fk_idx` (`friend_code` ASC) VISIBLE,
  CONSTRAINT `user_fk`
    FOREIGN KEY (`user_code`)
    REFERENCES `walkhistory`.`user` (`user_code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `friend_fk`
    FOREIGN KEY (`friend_code`)
    REFERENCES `walkhistory`.`user` (`user_code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

    CREATE TABLE `walkhistory`.`line` (
  `record_code` INT NOT NULL,
  `sequence` INT NOT NULL,
  `lat_from` DOUBLE NOT NULL,
  `lon_from` DOUBLE NOT NULL,
  `lat_to` DOUBLE NOT NULL,
  `lon_to` DOUBLE NOT NULL,
  PRIMARY KEY (`record_code`, `sequence`),
  CONSTRAINT `record_fk`
    FOREIGN KEY (`record_code`)
    REFERENCES `walkhistory`.`record` (`record_code`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

    CREATE TABLE `walkhistory`.`area` (
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  PRIMARY KEY (`latitude`, `longitude`));

CREATE TABLE `walkhistory`.`line_pass_area` (
  `record_code` INT NOT NULL,
  `sequence` INT NOT NULL,
  `latitude` DOUBLE NOT NULL,
  `longotude` DOUBLE NOT NULL,
  PRIMARY KEY (`record_code`, `sequence`, `latitude`, `longotude`),
  INDEX `area_fk_idx` (`latitude` ASC, `longotude` ASC) VISIBLE,
  CONSTRAINT `line_fk`
    FOREIGN KEY (`record_code` , `sequence`)
    REFERENCES `walkhistory`.`line` (`record_code` , `sequence`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `area_fk`
    FOREIGN KEY (`latitude` , `longotude`)
    REFERENCES `walkhistory`.`area` (`latitude` , `longitude`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);