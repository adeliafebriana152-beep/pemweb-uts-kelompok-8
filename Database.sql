CREATE DATABASE  IF NOT EXISTS `db_pemweb_uts_kelompok_8` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_pemweb_uts_kelompok_8`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: db_pemweb_uts_kelompok_8
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `judul` varchar(150) NOT NULL,
  `deskripsi` text,
  `kategori` enum('Akademik','Non-Akademik') NOT NULL DEFAULT 'Akademik',
  `tanggal` date NOT NULL,
  `waktu` time NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `kuota` int unsigned NOT NULL DEFAULT '0',
  `status` enum('dibuka','ditutup','selesai') NOT NULL DEFAULT 'dibuka',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tanggal` (`tanggal`),
  KEY `idx_status` (`status`),
  KEY `idx_kategori` (`kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'Seminar Teknologi 2026','Seminar tentang perkembangan AI','Akademik','2026-12-05','09:00:00','Auditorium Dwi Tunggal',100,'dibuka','2026-11-09 05:24:56','2026-11-09 05:24:56'),(2,'Workshop Web Development','Belajar membuat web dengan PHP & MySQL','Akademik','2026-12-12','13:00:00','Lab Komputer 2',40,'dibuka','2026-11-09 05:24:56','2026-11-09 05:24:56'),(3,'Turnamen Futsal Antar Jurusan','Kompetisi Basket tahunan','Non-Akademik','2026-11-20','08:00:00','Lapangan Basket Kampus',60,'ditutup','2026-11-09 05:24:56','2026-11-09 05:24:56'),(4,'Pelatihan Desain Grafis','Pelatihan dasar desain grafis','Non-Akademik','2026-10-01','10:00:00','Ruang Multimedia',30,'selesai','2026-11-09 05:24:56','2026-11-09 05:24:56');
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `panitia`
--

DROP TABLE IF EXISTS `panitia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `panitia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `divisi` varchar(50) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `panitia_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `panitia`
--

LOCK TABLES `panitia` WRITE;
/*!40000 ALTER TABLE `panitia` DISABLE KEYS */;
INSERT INTO `panitia` VALUES (1,'Sisilia Hambut','42530001','Kesekretariatan','Koordinator','Perempuan',1),(2,'Adelia Febriana','42530002','Acara','Anggota','Perempuan',1),(3,'Zeaboth Havy','42530003','Konsumsi','Anggota','Laki-laki',1),(4,'Riski Helben','42530004','Humas','Koordinator','Laki-laki',1),(5,'Catherine','42530005','Pubdekdok','Anggota','Perempuan',1),(8,'Oka Cahaya Praditya','42530023','Ketua','Koordinator','Laki-laki',1);
/*!40000 ALTER TABLE `panitia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `peserta`
--

DROP TABLE IF EXISTS `peserta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `peserta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `nim` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `prodi` varchar(80) NOT NULL,
  `event_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nim` (`nim`),
  KEY `fk_peserta_event` (`event_id`),
  CONSTRAINT `fk_peserta_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `peserta`
--

LOCK TABLES `peserta` WRITE;
/*!40000 ALTER TABLE `peserta` DISABLE KEYS */;
INSERT INTO `peserta` VALUES (1,'Dhea','42530012','dhea@gmail.com','087819322579','Teknologi Informasi',1),(2,'Emilia','42530023','emilia@gmail.com','089876543210','Informatika',1),(3,'Abel','42530008','abel@gmail.com','087819322540','management',1),(4,'Sisil','42530011','aura@gmail.com','087819322541','akuntansi',1);
/*!40000 ALTER TABLE `peserta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tugas`
--

DROP TABLE IF EXISTS `tugas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tugas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_task` varchar(150) NOT NULL,
  `divisi` enum('Kesekretariatan','Acara','Konsumsi','Humas','PubDekDok') NOT NULL,
  `prioritas` enum('rendah','sedang','tinggi') NOT NULL DEFAULT 'sedang',
  `tgl_deadline` date NOT NULL,
  `status_task` enum('belum','proses','selesai') NOT NULL DEFAULT 'belum',
  `panitia_id` int DEFAULT NULL,
  `event_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tugas_event` (`event_id`),
  KEY `fk_tugas_panitia` (`panitia_id`),
  CONSTRAINT `fk_tugas_event` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tugas_panitia` FOREIGN KEY (`panitia_id`) REFERENCES `panitia` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tugas`
--

LOCK TABLES `tugas` WRITE;
/*!40000 ALTER TABLE `tugas` DISABLE KEYS */;
INSERT INTO `tugas` VALUES (1,'surat survey kampus','Kesekretariatan','tinggi','2026-11-17','proses',1,1),(2,'Rekap data peserta dan absensi','Kesekretariatan','sedang','2026-11-18','belum',1,1),(3,'Susun rundown acara','Acara','tinggi','2026-11-12','proses',2,1),(4,'Booking aula dan sound system','Acara','tinggi','2026-11-07','proses',2,1),(5,'Pesan konsumsi peserta','Konsumsi','sedang','2026-11-18','belum',3,1),(6,'Pesan snack dan air mineral','Konsumsi','rendah','2026-11-19','belum',NULL,1),(7,'Kirim undangan pembicara','Humas','tinggi','2026-11-10','proses',4,1),(8,'Desain poster dan banner','PubDekDok','sedang','2026-11-08','selesai',5,1),(9,'Booking fotografer','PubDekDok','rendah','2026-11-15','belum',5,1);
/*!40000 ALTER TABLE `tugas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-09 20:20:03
