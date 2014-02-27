SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `het` ;
CREATE SCHEMA IF NOT EXISTS `het` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci ;
USE `het` ;

-- -----------------------------------------------------
-- Table `het`.`pengawas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`pengawas` ;

CREATE TABLE IF NOT EXISTS `het`.`pengawas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(50) NOT NULL,
  `no_hp` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `no_hp_UNIQUE` (`no_hp` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `het`.`sarana_pelayanan`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`sarana_pelayanan` ;

CREATE TABLE IF NOT EXISTS `het`.`sarana_pelayanan` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(50) NOT NULL,
  `kode_sarana` VARCHAR(20) NOT NULL,
  `alamat` VARCHAR(500) NOT NULL,
  `no_telp` VARCHAR(20) NOT NULL,
  `id_pengawas` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_sarana_pelayanan_pengawas_idx` (`id_pengawas` ASC),
  UNIQUE INDEX `kode_sarana_UNIQUE` (`kode_sarana` ASC),
  CONSTRAINT `fk_sarana_pelayanan_pengawas`
    FOREIGN KEY (`id_pengawas`)
    REFERENCES `het`.`pengawas` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `het`.`het`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`het` ;

CREATE TABLE IF NOT EXISTS `het`.`het` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `kode_obat` VARCHAR(8) NOT NULL,
  `nama_obat` VARCHAR(50) NOT NULL,
  `het` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `kode_obat_UNIQUE` (`kode_obat` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `het`.`pelaporan_het`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`pelaporan_het` ;

CREATE TABLE IF NOT EXISTS `het`.`pelaporan_het` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `id_het` BIGINT NOT NULL,
  `id_sarana_pelayanan` BIGINT NOT NULL,
  `harga` INT UNSIGNED NOT NULL,
  `stamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_pelaporan_het_het1_idx` (`id_het` ASC),
  INDEX `fk_pelaporan_het_sarana_pelayanan1_idx` (`id_sarana_pelayanan` ASC),
  CONSTRAINT `fk_pelaporan_het_het1`
    FOREIGN KEY (`id_het`)
    REFERENCES `het`.`het` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_pelaporan_het_sarana_pelayanan1`
    FOREIGN KEY (`id_sarana_pelayanan`)
    REFERENCES `het`.`sarana_pelayanan` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `het`.`log_sms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`log_sms` ;

CREATE TABLE IF NOT EXISTS `het`.`log_sms` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `phone_number` VARCHAR(20) NOT NULL,
  `message` VARCHAR(500) NOT NULL,
  `sms_center` VARCHAR(20) NOT NULL,
  `stamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `error` CHAR(1) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

INSERT INTO `log_sms` (`id`, `phone_number`, `message`, `sms_center`, `stamp`, `error`) VALUES
(1, '+6282115529936', 'Test_1234', 'telkomsel', '2014-02-24 01:40:02', '4'),
(2, '+6282115521136', 'AMOX_2000', 'telkomsel', '2014-02-24 01:40:02', '1'),
(3, '+6282115529936', 'AMOX 2000', 'telkomsel', '2014-02-24 01:40:02', '2'),
(4, '+6282115529936', 'AMOX_0', 'telkomsel', '2014-02-24 01:40:02', '3'),
(5, '+6282115529936', 'AMOX_1000', 'telkomsel', '2014-02-24 01:40:02', '5'),
(6, '+6282115529936', 'AMOX_3000', '', '2014-02-24 01:44:38', '0');


-- -----------------------------------------------------
-- Table `het`.`parameter`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `het`.`parameter` ;

CREATE TABLE IF NOT EXISTS `het`.`parameter` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `kode` VARCHAR(20) NOT NULL,
  `isi` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `kode_UNIQUE` (`kode` ASC))
ENGINE = InnoDB;

USE `het` ;

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_combo_pengawas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_combo_pengawas` (`id_pengawas` INT, `nama_pengawas` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_het_pelaporan`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_het_pelaporan` (`id` INT, `kode_obat` INT, `nama_obat` INT, `het` INT, `jumlah_laporan` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_id_het_sarana`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_id_het_sarana` (`id_het` INT, `id_sarana_pelayanan` INT, `kode_obat` INT, `het` INT, `kode_sarana` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_list_pelaporan_het`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_list_pelaporan_het` (`id` INT, `id_het` INT, `id_sarana_pelayanan` INT, `harga` INT, `stamp` INT, `kode_obat` INT, `nama_obat` INT, `het` INT, `alamat` INT, `nama_sarana` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_list_pengawas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_list_pengawas` (`id` INT, `nama` INT, `no_hp` INT, `kode_sarana` INT, `nama_sarana` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_list_sarana`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_list_sarana` (`id` INT, `nama` INT, `kode_sarana` INT, `alamat` INT, `no_telp` INT, `id_pengawas` INT, `nama_pengawas` INT);

-- -----------------------------------------------------
-- Placeholder table for view `het`.`v_pelaporan_het`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `het`.`v_pelaporan_het` (`id_pelaporan` INT, `id_het` INT, `id_sarana_pelayanan` INT, `harga` INT, `stamp` INT, `nama_sarana` INT, `alamat` INT, `no_telp` INT);

-- -----------------------------------------------------
-- function f_get_pelaporan_het
-- -----------------------------------------------------

USE `het`;
DROP function IF EXISTS `het`.`f_get_pelaporan_het`;

DELIMITER $$
USE `het`$$


CREATE DEFINER=`root`@`localhost` FUNCTION `f_get_pelaporan_het`(idhet bigint) RETURNS int(11)
BEGIN
RETURN
(
  select count(*)
  from pelaporan_het
  where id_het = idhet
);
END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `het`.`v_combo_pengawas`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_combo_pengawas` ;
DROP TABLE IF EXISTS `het`.`v_combo_pengawas`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_combo_pengawas` AS select `het`.`pengawas`.`id` AS `id_pengawas`,`het`.`pengawas`.`nama` AS `nama_pengawas` from `het`.`pengawas`;

-- -----------------------------------------------------
-- View `het`.`v_het_pelaporan`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_het_pelaporan` ;
DROP TABLE IF EXISTS `het`.`v_het_pelaporan`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_het_pelaporan` AS select `het`.`het`.`id` AS `id`,`het`.`het`.`kode_obat` AS `kode_obat`,`het`.`het`.`nama_obat` AS `nama_obat`,`het`.`het`.`het` AS `het`,`het`.`f_get_pelaporan_het`(`het`.`het`.`id`) AS `jumlah_laporan` from `het`.`het`;

-- -----------------------------------------------------
-- View `het`.`v_id_het_sarana`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_id_het_sarana` ;
DROP TABLE IF EXISTS `het`.`v_id_het_sarana`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_id_het_sarana` AS select `het`.`het`.`id` AS `id_het`,`sar`.`id` AS `id_sarana_pelayanan`,`het`.`het`.`kode_obat` AS `kode_obat`,`het`.`het`.`het` AS `het`,`sar`.`kode_sarana` AS `kode_sarana` from (`het`.`het` join `het`.`sarana_pelayanan` `sar`);

-- -----------------------------------------------------
-- View `het`.`v_list_pelaporan_het`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_list_pelaporan_het` ;
DROP TABLE IF EXISTS `het`.`v_list_pelaporan_het`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_list_pelaporan_het` AS select `ph`.`id` AS `id`,`ph`.`id_het` AS `id_het`,`ph`.`id_sarana_pelayanan` AS `id_sarana_pelayanan`,`ph`.`harga` AS `harga`,`ph`.`stamp` AS `stamp`,`het`.`het`.`kode_obat` AS `kode_obat`,`het`.`het`.`nama_obat` AS `nama_obat`,`het`.`het`.`het` AS `het`,`sp`.`alamat` AS `alamat`,`sp`.`nama` AS `nama_sarana` from ((`het`.`pelaporan_het` `ph` join `het`.`het` on((`ph`.`id_het` = `het`.`het`.`id`))) join `het`.`sarana_pelayanan` `sp` on((`ph`.`id_sarana_pelayanan` = `sp`.`id`)));

-- -----------------------------------------------------
-- View `het`.`v_list_pengawas`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_list_pengawas` ;
DROP TABLE IF EXISTS `het`.`v_list_pengawas`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_list_pengawas` AS select `p`.`id` AS `id`,`p`.`nama` AS `nama`,`p`.`no_hp` AS `no_hp`,`sp`.`kode_sarana` AS `kode_sarana`,`sp`.`nama` AS `nama_sarana` from (`het`.`pengawas` `p` join `het`.`sarana_pelayanan` `sp` on((`p`.`id` = `sp`.`id_pengawas`)));

-- -----------------------------------------------------
-- View `het`.`v_list_sarana`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_list_sarana` ;
DROP TABLE IF EXISTS `het`.`v_list_sarana`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_list_sarana` AS select `sp`.`id` AS `id`,`sp`.`nama` AS `nama`,`sp`.`kode_sarana` AS `kode_sarana`,`sp`.`alamat` AS `alamat`,`sp`.`no_telp` AS `no_telp`,`sp`.`id_pengawas` AS `id_pengawas`,`p`.`nama` AS `nama_pengawas` from (`het`.`sarana_pelayanan` `sp` join `het`.`pengawas` `p`) where (`sp`.`id_pengawas` = `p`.`id`);

-- -----------------------------------------------------
-- View `het`.`v_pelaporan_het`
-- -----------------------------------------------------
DROP VIEW IF EXISTS `het`.`v_pelaporan_het` ;
DROP TABLE IF EXISTS `het`.`v_pelaporan_het`;
USE `het`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `het`.`v_pelaporan_het` AS select `ph`.`id` AS `id_pelaporan`,`ph`.`id_het` AS `id_het`,`ph`.`id_sarana_pelayanan` AS `id_sarana_pelayanan`,`ph`.`harga` AS `harga`,`ph`.`stamp` AS `stamp`,`sp`.`nama` AS `nama_sarana`,`sp`.`alamat` AS `alamat`,`sp`.`no_telp` AS `no_telp` from (`het`.`pelaporan_het` `ph` join `het`.`sarana_pelayanan` `sp` on((`ph`.`id_sarana_pelayanan` = `sp`.`id`)));

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `het`.`pengawas`
-- -----------------------------------------------------
START TRANSACTION;
USE `het`;
INSERT INTO `het`.`pengawas` (`id`, `nama`, `no_hp`) VALUES (1, 'Eko Prasetyo', '+6282115529936');
INSERT INTO `het`.`pengawas` (`id`, `nama`, `no_hp`) VALUES (2, 'Lia', '+628996981277');

COMMIT;


-- -----------------------------------------------------
-- Data for table `het`.`sarana_pelayanan`
-- -----------------------------------------------------
START TRANSACTION;
USE `het`;
INSERT INTO `het`.`sarana_pelayanan` (`id`, `nama`, `kode_sarana`, `alamat`, `no_telp`, `id_pengawas`) VALUES (1, 'Apotik Antah Berantah', 'ANTAH', 'Jl. Entah dimana No.1 Wewengkon Timur', '02278112415', 1);
INSERT INTO `het`.`sarana_pelayanan` (`id`, `nama`, `kode_sarana`, `alamat`, `no_telp`, `id_pengawas`) VALUES (2, 'Apotik Lia', 'LIA', 'Jl. Asdfg No.213 Bandung', '021414124214', 2);

COMMIT;


-- -----------------------------------------------------
-- Data for table `het`.`het`
-- -----------------------------------------------------
START TRANSACTION;
USE `het`;
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (1, 'APTX-8', 'APTX-88214', 20000);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (2, 'AMOX', 'Amoxilin', 1000);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (3, 'ACCO', 'ACCOLATE TABLET', 288580);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (4, 'BANADOZ', 'BANADOZ TABLET 200 MG', 598950);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (5, 'TAMOFEN', 'TAMOFEN TABLET 10 MG', 87120);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (6, 'NADIFEN', 'NADIFEN TABLET 50 MG', 33880);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (7, 'KALCINOL', 'KALCINOL-N CREAM 5 G', 8000);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (8, 'IBOLTAB', 'IBOL TABLET 200 MG', 36000);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (9, 'ACETOS', 'Acetosal', 10000);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (10, 'ALBENDA', 'Albendazol tablet 400 mg  ', 16470);
INSERT INTO `het`.`het` (`id`, `kode_obat`, `nama_obat`, `het`) VALUES (11, 'PARASE', 'Parasetamol', 1650);

COMMIT;


-- -----------------------------------------------------
-- Data for table `het`.`pelaporan_het`
-- -----------------------------------------------------
START TRANSACTION;
USE `het`;
INSERT INTO `het`.`pelaporan_het` (`id`, `id_het`, `id_sarana_pelayanan`, `harga`, `stamp`) VALUES (1, 1, 1, 30000, '2014-02-01 10:10:10');
INSERT INTO `het`.`pelaporan_het` (`id`, `id_het`, `id_sarana_pelayanan`, `harga`, `stamp`) VALUES (2, 2, 1, 1200, '2014-02-01 10:10:10');
INSERT INTO `het`.`pelaporan_het` (`id`, `id_het`, `id_sarana_pelayanan`, `harga`, `stamp`) VALUES (3, 3, 1, 500000, '2014-02-01 10:10:10');
INSERT INTO `het`.`pelaporan_het` (`id`, `id_het`, `id_sarana_pelayanan`, `harga`, `stamp`) VALUES (4, 1, 2, 33000, '2014-02-11 11:11:11');

COMMIT;


-- -----------------------------------------------------
-- Data for table `het`.`parameter`
-- -----------------------------------------------------
START TRANSACTION;
USE `het`;
INSERT INTO `het`.`parameter` (`id`, `kode`, `isi`) VALUES (1, 'SMS_GATE_WAY_URL', '192.168.43.1:9090');

COMMIT;

