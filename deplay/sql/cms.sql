-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: cms
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alarm_rules`
--

DROP TABLE IF EXISTS `alarm_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) DEFAULT NULL COMMENT '规则名',
  `rule_key` varchar(100) DEFAULT NULL COMMENT '唯一键',
  `rule_value` varchar(100) DEFAULT NULL COMMENT '规则',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='告警通知设置';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm_rules`
--

LOCK TABLES `alarm_rules` WRITE;
/*!40000 ALTER TABLE `alarm_rules` DISABLE KEYS */;
INSERT INTO `alarm_rules` VALUES (1,'规则121','哈哈怼21','的水滴石穿吃的21');
/*!40000 ALTER TABLE `alarm_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `args`
--

DROP TABLE IF EXISTS `args`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `args` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arg_key` varchar(100) DEFAULT NULL COMMENT '参数键，如 idle_timeout',
  `arg_name` varchar(100) DEFAULT NULL COMMENT '参数中文名，如 呆滞时间',
  `arg_value` varchar(100) DEFAULT NULL COMMENT '参数值（统一存字符串）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='业务参数表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `args`
--

LOCK TABLES `args` WRITE;
/*!40000 ALTER TABLE `args` DISABLE KEYS */;
INSERT INTO `args` VALUES (1,'key11','key11','value11'),(2,'c',' 吃',' 吃s'),(4,'211','2121','21212');
/*!40000 ALTER TABLE `args` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset` (
  `asset_id` int NOT NULL AUTO_INCREMENT COMMENT '资产ID（主键）',
  `asset_code` varchar(255) DEFAULT NULL COMMENT '资产编码',
  `asset_type` int DEFAULT NULL COMMENT '资产类型 (0-牵引车、1-工装车)',
  `status` int DEFAULT NULL COMMENT '资产状态 (在库/在途/疑似丢失/未知/未设置/流转异常/呆滞)',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `store_id` int DEFAULT NULL COMMENT '场库ID',
  `quantity` int DEFAULT NULL COMMENT '资产数量',
  PRIMARY KEY (`asset_id`),
  UNIQUE KEY `uniq_asset_code` (`asset_code`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (31,'015',8,1,'2026-07-27 06:22:43','2026-07-27 06:46:26',NULL,1);
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_groups`
--

DROP TABLE IF EXISTS `asset_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_groups` (
  `asset_id` int NOT NULL,
  `group_id` int DEFAULT NULL,
  PRIMARY KEY (`asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产与班组的对应表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_groups`
--

LOCK TABLES `asset_groups` WRITE;
/*!40000 ALTER TABLE `asset_groups` DISABLE KEYS */;
INSERT INTO `asset_groups` VALUES (14,1),(15,1),(17,1),(25,3),(31,3);
/*!40000 ALTER TABLE `asset_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_repairs`
--

DROP TABLE IF EXISTS `asset_repairs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_repairs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `repair_reason` varchar(255) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_asset_id` (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产维修表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_repairs`
--

LOCK TABLES `asset_repairs` WRITE;
/*!40000 ALTER TABLE `asset_repairs` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_repairs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_tags`
--

DROP TABLE IF EXISTS `asset_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `asset_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_asset_id` (`asset_id`),
  UNIQUE KEY `uniq_tag_id` (`tag_id`),
  KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_tags`
--

LOCK TABLES `asset_tags` WRITE;
/*!40000 ALTER TABLE `asset_tags` DISABLE KEYS */;
INSERT INTO `asset_tags` VALUES (7,31,6,'2026-07-27 06:46:26');
/*!40000 ALTER TABLE `asset_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_types`
--

DROP TABLE IF EXISTS `asset_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_types` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(255) DEFAULT NULL COMMENT '资产类型名称',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产和资产类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_types`
--

LOCK TABLES `asset_types` WRITE;
/*!40000 ALTER TABLE `asset_types` DISABLE KEYS */;
INSERT INTO `asset_types` VALUES (1,'Dolly车'),(6,'双层平板车'),(7,'专用料架'),(8,'通用料架');
/*!40000 ALTER TABLE `asset_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buzzers`
--

DROP TABLE IF EXISTS `buzzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buzzers` (
  `buzzer_id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `buzzer_rule` varchar(100) DEFAULT NULL COMMENT '蜂鸣器报警规则',
  PRIMARY KEY (`buzzer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='蜂鸣器报警规则表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buzzers`
--

LOCK TABLES `buzzers` WRITE;
/*!40000 ALTER TABLE `buzzers` DISABLE KEYS */;
INSERT INTO `buzzers` VALUES (2,'呜呜呜  谢谢搜索33'),(3,' 传惨'),(4,'垃圾'),(6,'线下'),(7,'哈哈哈尺寸');
/*!40000 ALTER TABLE `buzzers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` varchar(36) NOT NULL,
  `department_name` varchar(36) NOT NULL,
  `parent_department` varchar(36) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT (now()),
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` timestamp NULL DEFAULT NULL,
  `department_order` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_pk_2` (`id`),
  UNIQUE KEY `department_pk_3` (`department_name`),
  KEY `department_department_id_fk` (`parent_department`),
  CONSTRAINT `department_department_id_fk` FOREIGN KEY (`parent_department`) REFERENCES `department` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES ('47230539865788416','旭升科技有限责任公司',NULL,'2024-05-10 15:57:18','2024-05-10 21:29:05',NULL,0,'旭升科技有限责任公司'),('47230730614345728','旭升科技有限责任公司（成都分公司）',NULL,'2024-05-10 15:58:03','2024-05-10 21:28:57',NULL,1,'旭升科技有限责任公司（成都分公司）'),('47230853654253568','软件开发部','47230539865788416','2024-05-10 15:58:33','2024-05-10 15:58:33',NULL,0,'软件开发部'),('47230946730053632','前端部门','47230853654253568','2024-05-10 15:58:55','2024-05-10 17:10:40',NULL,0,'负责软件界面开发'),('47231640862199808','市场营销部','47230539865788416','2024-05-10 16:01:40','2024-05-10 16:01:40',NULL,1,'市场营销'),('47231703478964224','人事部','47230539865788416','2024-05-10 16:01:55','2024-05-10 16:02:00',NULL,2,'人事部'),('47231806839197696','采购部','47230539865788416','2024-05-10 16:02:20','2024-05-10 16:02:20',NULL,3,'采购'),('47231951035174912','国际贸易部','47230730614345728','2024-05-10 16:02:54','2024-05-10 16:02:54',NULL,0,'国际贸易部'),('47248253208498176','Java开发部','47230853654253568','2024-05-10 17:07:41','2024-05-10 17:07:41',NULL,1,'Java开发部');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT COMMENT '资产部门ID',
  `department_name` varchar(100) DEFAULT NULL COMMENT '资产部门名称',
  `store_id` int DEFAULT NULL COMMENT '一一对应场库',
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产部门';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exception_records`
--

DROP TABLE IF EXISTS `exception_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exception_records` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `exception_type` int DEFAULT NULL COMMENT '异常类型',
  `asset_id` int DEFAULT NULL COMMENT '相关的资产id',
  `detection_time` datetime DEFAULT NULL COMMENT '检测时间',
  `status` int DEFAULT NULL COMMENT '处理状态',
  `exception_note` text COMMENT '异常内容',
  `remark` varchar(100) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='异常记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exception_records`
--

LOCK TABLES `exception_records` WRITE;
/*!40000 ALTER TABLE `exception_records` DISABLE KEYS */;
INSERT INTO `exception_records` VALUES (1,0,0,'2025-08-07 13:08:39',1,'22','','2025-08-07 13:08:39','2026-01-08 10:53:02');
/*!40000 ALTER TABLE `exception_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gardens`
--

DROP TABLE IF EXISTS `gardens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gardens` (
  `garden_id` int NOT NULL AUTO_INCREMENT COMMENT '园区id',
  `garden_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`garden_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='园区信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gardens`
--

LOCK TABLES `gardens` WRITE;
/*!40000 ALTER TABLE `gardens` DISABLE KEYS */;
INSERT INTO `gardens` VALUES (4,'雨花');
/*!40000 ALTER TABLE `gardens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gateways`
--

DROP TABLE IF EXISTS `gateways`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gateways` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gateway_name` varchar(100) DEFAULT NULL COMMENT '网关名称',
  `gateway_code` varchar(100) DEFAULT NULL COMMENT '唯一编码，例如设备序列号、MAC',
  `gateway_type` int DEFAULT NULL COMMENT '网关类型 (1:入库, 2:出库, 3:盘点)',
  `ip_address` varchar(100) DEFAULT NULL COMMENT 'IP地址',
  `port` int DEFAULT NULL COMMENT '端口',
  `status` int DEFAULT NULL COMMENT '网关状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='网关表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gateways`
--

LOCK TABLES `gateways` WRITE;
/*!40000 ALTER TABLE `gateways` DISABLE KEYS */;
INSERT INTO `gateways` VALUES (2,'12#基站','12-01',3,'192.168.1.100',20058,1);
/*!40000 ALTER TABLE `gateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_stores`
--

DROP TABLE IF EXISTS `group_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_stores` (
  `group_id` int NOT NULL COMMENT '班组ID',
  `store_id` int DEFAULT NULL COMMENT '场库ID',
  PRIMARY KEY (`group_id`),
  KEY `idx_group_stores_store_id` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班组与场库对应关系';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_stores`
--

LOCK TABLES `group_stores` WRITE;
/*!40000 ALTER TABLE `group_stores` DISABLE KEYS */;
INSERT INTO `group_stores` VALUES (1,2),(2,2),(3,3),(4,2);
/*!40000 ALTER TABLE `group_stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) NOT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `uniq_group_name` (`group_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班组';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'上海组'),(2,'湖北组'),(3,'湖南组'),(4,'西班牙组');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interfaces`
--

DROP TABLE IF EXISTS `interfaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interfaces` (
  `interface_id` varchar(36) NOT NULL,
  `interface_name` varchar(255) DEFAULT NULL,
  `interface_method` varchar(10) NOT NULL,
  `interface_path` varchar(255) NOT NULL,
  `interface_page_id` varchar(36) NOT NULL,
  `interface_dic` varchar(36) NOT NULL,
  `interface_desc` varchar(255) DEFAULT NULL,
  `can_edit` tinyint(1) DEFAULT '1',
  `create_time` timestamp NULL DEFAULT (now()),
  `update_time` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`interface_id`),
  UNIQUE KEY `interface_pk` (`interface_id`),
  KEY `interface_pages_page_id_fk` (`interface_page_id`),
  CONSTRAINT `interface_pages_page_id_fk` FOREIGN KEY (`interface_page_id`) REFERENCES `pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='接口/资源表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interfaces`
--

LOCK TABLES `interfaces` WRITE;
/*!40000 ALTER TABLE `interfaces` DISABLE KEYS */;
INSERT INTO `interfaces` VALUES ('37899586299236352','获取菜单','GET','/pages','40708567220621312','GET:/pages','获取菜单',0,'2024-04-14 21:59:25','2024-05-11 16:04:13'),('37899744348999680','获取用户菜单','GET','/pages/menus','40708567220621312','GET:/pages/menus','获取用户菜单',0,'2024-04-14 22:00:03','2024-05-11 16:04:13'),('40696216958275584','新建菜单','POST','/pages','40708567220621312','POST:/pages','新建菜单',0,'2024-04-22 15:12:14','2024-05-11 16:04:13'),('41065294818447360','创建用户','POST','/users','40351711566499840','POST:/users','创建用户',0,'2024-04-23 15:38:49','2024-05-11 16:04:13'),('41789444067430400','获取用户','POST','/users/query','40351711566499840','POST:/users/query','获取用户',0,'2024-04-25 17:20:52','2024-05-11 16:04:13'),('41903454221766656','获取角色','POST','/roles/query','40352343601975296','POST:/roles/query','获取角色',0,'2024-04-25 23:09:21','2024-05-11 16:04:13'),('41906647861301248','获取部门','GET','/department','40352749044371456','GET:/department','获取部门',0,'2024-04-25 23:22:03','2024-05-11 16:04:13'),('42063400649363456','更新用户','PATCH','/users/:id','40351711566499840','PATCH:/users/:id','更新用户',0,'2024-04-26 09:44:56','2024-05-11 16:04:13'),('42071947340681216','删除用户','DELETE','/users/:id','40351711566499840','DELETE:/users/:id','删除用户',0,'2024-04-26 10:18:53','2024-05-11 16:04:13'),('42079060825739264','获取用户详情','GET','/users/:id','40351711566499840','GET:/users/:id','获取用户详情',0,'2024-04-26 10:47:09','2024-05-11 17:24:40'),('44326032676753408','删除角色','DELETE','/roles/:id','40352343601975296','DELETE:/roles/:id','获取Git提交次数',0,'2024-05-02 15:35:49','2024-05-11 16:04:13'),('44332995393359872','导出角色','POST','/roles/export','40352343601975296','POST:/roles/export','导出角色',0,'2024-05-02 16:03:29','2024-05-11 16:04:13'),('44333062707744768','导出用户','POST','/users/export','40351711566499840','POST:/users/export','导出用户',0,'2024-05-02 16:03:45','2024-05-11 16:04:13'),('44474438040686592','更新角色','PATCH','/roles/:id','40352343601975296','PATCH:/roles/:id','更新角色',0,'2024-05-03 01:25:32','2024-05-11 16:04:13'),('45864670036234240','新增角色','POST','/roles','40352343601975296','POST:/roles','新增角色',0,'2024-05-06 21:29:49','2024-05-11 16:04:13'),('46239031234662400','通过角色ID查询用户','GET','/users/role/:id','40352343601975296','GET:/users/role/:id','通过角色ID查询用户',0,'2024-05-07 22:17:24','2024-05-11 16:04:13'),('46858901232029696','绑定用户','POST','/roles/bindUser','40352343601975296','POST:/roles/bindUser','绑定用户',0,'2024-05-09 15:20:32','2024-05-11 16:04:13'),('46859015694585856','解绑用户','POST','/roles/deBindUser','40352343601975296','POST:/roles/deBindUser','解绑用户',0,'2024-05-09 15:20:59','2024-05-11 16:04:13'),('46859424727306240','查询角色之外的用户','POST','/users/query/role/:id','40352343601975296','POST:/users/query/role/:id','查询角色之外的用户',0,'2024-05-09 15:22:37','2024-05-11 16:04:13'),('46862379094380544','创建菜单','POST','/pages','40708567220621312','POST:/pages','创建菜单',0,'2024-05-09 15:34:21','2024-05-11 16:04:13'),('46862511944765440','删除菜单','DELETE','/pages/:id','40708567220621312','DELETE:/pages/:id','创建菜单',0,'2024-05-09 15:34:53','2024-05-11 16:04:13'),('46862830229524480','获取菜单（All）','GET','/pages','40708567220621312','GET:/pages','获取菜单（All）',0,'2024-05-09 15:36:09','2024-05-11 16:04:13'),('46863099453509632','获取菜单（User）','GET','/pages/user','40708567220621312','GET:/pages/user','获取菜单（User）',0,'2024-05-09 15:37:13','2024-05-11 16:04:13'),('46863346367991808','更新菜单','PATCH','/pages/:id','40708567220621312','PATCH:/pages/:id','PATCH',0,'2024-05-09 15:38:12','2024-05-11 16:04:13'),('46863589419520000','获取菜单（Role）','GET','/pages/role/:id','40708567220621312','GET:/pages/role/:id','GET',0,'2024-05-09 15:39:10','2024-05-11 16:04:13'),('47156442767036416','创建部门','POST','/department','40352749044371456','POST:/department','创建部门',0,'2024-05-10 11:02:52','2024-05-11 16:04:13'),('47216551878725632','删除部门','DELETE','/department/:id','40352749044371456','DELETE:/department/:id','删除部门',0,'2024-05-10 15:01:43','2024-05-11 16:04:13'),('47216745617821696','更新部门','PATCH','/department/:id','40352749044371456','PATCH:/department/:id','更新部门',0,'2024-05-10 15:02:29','2024-05-11 16:04:13'),('47584267768696832','获取接口（Page）','GET','/interface/page/:id','40708567220621312','GET:/interface/page/:id','获取接口（Page）',0,'2024-05-11 15:22:53','2024-05-11 16:04:13'),('47593342061514752','删除接口','DELETE','/interface/:id','40708567220621312','DELETE:/interface/:id','删除接口',0,'2024-05-11 15:58:57','2024-05-11 16:04:13'),('47608622313639936','新增接口','POST','/interface','40708567220621312','POST:/interface','新增接口',0,'2024-05-11 16:59:40','2024-05-11 17:00:53'),('47608882222075904','更新接口','PATCH','/interface/:id','40708567220621312','PATCH:/interface/:id','更新接口',0,'2024-05-11 17:00:42','2024-05-11 17:06:39'),('47973984368594944','获取文件','GET','/upload','47973248603787264','GET:/upload','获取文件列表',0,'2024-05-12 17:11:29','2024-05-12 17:21:04'),('47974191147782144','删除文件','DELETE','/upload/del/:id','47973248603787264','DELETE:/upload/del/:id','删除文件',0,'2024-05-12 17:12:18','2024-05-12 17:21:04'),('47974424665657344','查看文件状态','POST','/upload/check','47973248603787264','POST:/upload/check','上传文件是需要检查文件是否上传以及上传了多少',0,'2024-05-12 17:13:14','2024-05-12 17:21:04'),('47974555385335808','上传文件','POST','/upload','47973248603787264','POST:/upload','上传文件',0,'2024-05-12 17:13:45','2024-05-12 17:21:04'),('47974732070391808','完成上传','POST','/upload/finish','47973248603787264','POST:/upload/finish','告诉服务器文件已全部上传完毕',0,'2024-05-12 17:14:27','2024-05-12 17:21:04'),('47974990527598592','文件下载（POST）','POST','/upload/download/:id','47973248603787264','POST:/upload/download/:id','通过Ajax下载文件',0,'2024-05-12 17:15:29','2024-05-12 17:21:04'),('47975191568977920','文件下载（GET）','GET','/upload/aHref/download/:id','47973248603787264','GET:/upload/aHref/download/:id','通过 a 标签下载文件',0,'2024-05-12 17:16:17','2024-05-12 17:21:04'),('47975597174951936','获取Cookie','GET','/auth/cookie','47973248603787264','GET:/auth/cookie','a标签下载文件需要先获取Cookie,该Ckooiie只能使用一次就会过期',0,'2024-05-12 17:17:53','2024-05-12 17:21:04'),('47976243613667328','获取系统日志','GET','/log/system','47975943540576256','GET:/log/system','获取系统日志',0,'2024-05-12 17:20:27','2024-05-12 17:21:04'),('49391522268844032','获取定时任务列表','GET','/timeTask','49387228375289856','GET:/timeTask','获取定时任务列表',1,'2024-05-16 15:04:16','2024-05-16 15:08:02'),('49391714045005824','开始定时任务','POST','/timeTask/start/:id','49387228375289856','POST:/timeTask/start/:id','开始定时任务',1,'2024-05-16 15:05:02','2024-05-16 15:05:02'),('49391851559456768','停止定时任务','POST','/timeTask/stop/:id','49387228375289856','POST:/timeTask/stop/:id','停止定时任务',1,'2024-05-16 15:05:35','2024-05-16 15:05:35'),('49392003502313472','更新定时任务','PATCH','/timeTask/update/:id','49387228375289856','PATCH:/timeTask/update/:id','更新定时任务',1,'2024-05-16 15:06:11','2024-05-16 15:06:11');
/*!40000 ALTER TABLE `interfaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_records`
--

DROP TABLE IF EXISTS `inventory_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_records` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `tag_code` varchar(100) NOT NULL COMMENT 'RFID标签码',
  `asset_id` int DEFAULT NULL COMMENT '资产ID',
  `store_id` int DEFAULT NULL COMMENT '场库ID',
  `gateway_id` int DEFAULT NULL COMMENT '网关ID',
  `inventory_time` timestamp NOT NULL COMMENT '盘点时间',
  `rssi` int DEFAULT NULL COMMENT '信号强度',
  `antenna_num` int DEFAULT NULL COMMENT '天线编号',
  `battery_level` varchar(10) DEFAULT NULL COMMENT '电池电量',
  `pc_value` varchar(10) DEFAULT NULL COMMENT 'PC值',
  `additional_category` int DEFAULT NULL COMMENT '附加类别',
  `inventory_status` int DEFAULT '1' COMMENT '盘点状态 (1:正常, 2:异常)',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_inventory_asset_tag` (`tag_code`,`asset_id`),
  KEY `idx_tag_code` (`tag_code`),
  KEY `idx_asset_id` (`asset_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_inventory_time` (`inventory_time`)
) ENGINE=InnoDB AUTO_INCREMENT=33353 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='盘点记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_records`
--

LOCK TABLES `inventory_records` WRITE;
/*!40000 ALTER TABLE `inventory_records` DISABLE KEYS */;
INSERT INTO `inventory_records` VALUES (33352,'11022190',31,NULL,2,'2026-07-27 10:06:15',67,0,'21','10',0,1,NULL,'2026-07-27 09:35:51');
/*!40000 ALTER TABLE `inventory_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `io_records`
--

DROP TABLE IF EXISTS `io_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `io_records` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `asset_id` int DEFAULT NULL COMMENT '资产ID',
  `action_type` int DEFAULT NULL COMMENT '操作类型',
  `action_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
  `store_from` int DEFAULT NULL COMMENT '起始仓库',
  `store_to` int DEFAULT NULL COMMENT '目标仓库',
  `tag_code` varchar(100) DEFAULT NULL COMMENT 'RFID 标签码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='出入库记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `io_records`
--

LOCK TABLES `io_records` WRITE;
/*!40000 ALTER TABLE `io_records` DISABLE KEYS */;
INSERT INTO `io_records` VALUES (1,0,1,'2025-06-04 05:14:33',NULL,NULL,NULL),(2,0,2,'2025-06-04 08:08:33',NULL,NULL,NULL),(3,0,2,'2025-06-04 08:08:36',NULL,NULL,NULL),(4,0,2,'2025-06-04 08:08:37',NULL,NULL,NULL),(5,0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(6,0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(7,0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(8,0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(9,0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(10,0,1,'2025-06-04 08:08:44',NULL,NULL,NULL),(11,0,1,'2025-06-04 08:08:44',NULL,NULL,NULL),(12,0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(13,0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(14,0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(15,0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(16,0,1,'2025-06-04 09:37:05',NULL,NULL,NULL),(17,0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(18,0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(19,0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(20,0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(21,0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(22,0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(23,0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(24,0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(25,6,1,'2025-06-05 03:46:04',0,1,NULL),(26,1,1,'2025-07-03 13:31:02',NULL,NULL,NULL),(27,1,1,'2025-07-03 13:31:04',NULL,NULL,NULL),(28,1,1,'2025-07-03 13:31:04',NULL,NULL,NULL),(29,1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(30,1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(31,1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(32,1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(33,1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(34,1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(35,1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(36,1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(37,1,0,'2025-07-03 13:31:10',NULL,NULL,NULL),(38,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(39,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(40,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(41,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(42,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(43,1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(44,1,0,'2025-07-03 13:31:12',NULL,NULL,NULL),(45,1,0,'2025-07-03 13:31:12',NULL,NULL,NULL),(46,1,2,'2025-07-03 13:38:06',NULL,NULL,NULL),(47,1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(48,1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(49,1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(50,1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(51,1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(52,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(53,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(54,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(55,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(56,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(57,1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(58,1,2,'2025-07-03 13:38:09',NULL,NULL,NULL),(59,27,3,'2026-01-07 05:42:16',NULL,NULL,'呃呃呃呃'),(60,28,3,'2026-01-07 05:42:16',NULL,NULL,'呃呃呃呃');
/*!40000 ALTER TABLE `io_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lines`
--

DROP TABLE IF EXISTS `lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lines` (
  `line_id` int NOT NULL AUTO_INCREMENT,
  `line_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`line_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='周转线路';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lines`
--

LOCK TABLES `lines` WRITE;
/*!40000 ALTER TABLE `lines` DISABLE KEYS */;
INSERT INTO `lines` VALUES (1,'线路12322'),(2,'线路2');
/*!40000 ALTER TABLE `lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitors`
--

DROP TABLE IF EXISTS `monitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitors` (
  `monitor_id` int NOT NULL AUTO_INCREMENT COMMENT '监控ID',
  `asset_id` int DEFAULT NULL,
  `detection_time` timestamp NULL DEFAULT NULL COMMENT '检测时间',
  `gateway_id` int DEFAULT NULL COMMENT '网关ID',
  PRIMARY KEY (`monitor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=759 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='车辆监控';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitors`
--

LOCK TABLES `monitors` WRITE;
/*!40000 ALTER TABLE `monitors` DISABLE KEYS */;
INSERT INTO `monitors` VALUES (1,2,'2025-06-05 08:46:30',2),(2,31,'2026-07-27 09:04:48',2),(3,31,'2026-07-27 09:04:50',2),(4,31,'2026-07-27 09:04:53',2),(5,31,'2026-07-27 09:04:55',2),(6,31,'2026-07-27 09:04:57',2),(7,31,'2026-07-27 09:04:59',2),(8,31,'2026-07-27 09:05:02',2),(9,31,'2026-07-27 09:05:04',2),(10,31,'2026-07-27 09:05:06',2),(11,31,'2026-07-27 09:05:08',2),(12,31,'2026-07-27 09:05:11',2),(13,31,'2026-07-27 09:05:13',2),(14,31,'2026-07-27 09:05:16',2),(15,31,'2026-07-27 09:05:18',2),(16,31,'2026-07-27 09:05:20',2),(17,31,'2026-07-27 09:05:22',2),(18,31,'2026-07-27 09:05:26',2),(19,31,'2026-07-27 09:05:28',2),(20,31,'2026-07-27 09:05:30',2),(21,31,'2026-07-27 09:05:34',2),(22,31,'2026-07-27 09:05:36',2),(23,31,'2026-07-27 09:05:38',2),(24,31,'2026-07-27 09:05:40',2),(25,31,'2026-07-27 09:05:42',2),(26,31,'2026-07-27 09:05:45',2),(27,31,'2026-07-27 09:05:47',2),(28,31,'2026-07-27 09:05:50',2),(29,31,'2026-07-27 09:05:53',2),(30,31,'2026-07-27 09:05:56',2),(31,31,'2026-07-27 09:05:58',2),(32,31,'2026-07-27 09:06:01',2),(33,31,'2026-07-27 09:06:03',2),(34,31,'2026-07-27 09:06:06',2),(35,31,'2026-07-27 09:06:09',2),(36,31,'2026-07-27 09:06:11',2),(37,31,'2026-07-27 09:06:13',2),(38,31,'2026-07-27 09:06:16',2),(39,31,'2026-07-27 09:06:18',2),(40,31,'2026-07-27 09:06:21',2),(41,31,'2026-07-27 09:06:24',2),(42,31,'2026-07-27 09:06:26',2),(43,31,'2026-07-27 09:06:28',2),(44,31,'2026-07-27 09:06:30',2),(45,31,'2026-07-27 09:06:33',2),(46,31,'2026-07-27 09:06:35',2),(47,31,'2026-07-27 09:06:38',2),(48,31,'2026-07-27 09:06:40',2),(49,31,'2026-07-27 09:06:42',2),(50,31,'2026-07-27 09:06:45',2),(51,31,'2026-07-27 09:06:47',2),(52,31,'2026-07-27 09:06:51',2),(53,31,'2026-07-27 09:06:53',2),(54,31,'2026-07-27 09:06:55',2),(55,31,'2026-07-27 09:06:57',2),(56,31,'2026-07-27 09:06:59',2),(57,31,'2026-07-27 09:07:02',2),(58,31,'2026-07-27 09:07:04',2),(59,31,'2026-07-27 09:07:06',2),(60,31,'2026-07-27 09:07:08',2),(61,31,'2026-07-27 09:07:11',2),(62,31,'2026-07-27 09:07:13',2),(63,31,'2026-07-27 09:07:15',2),(64,31,'2026-07-27 09:07:18',2),(65,31,'2026-07-27 09:07:21',2),(66,31,'2026-07-27 09:07:24',2),(67,31,'2026-07-27 09:07:26',2),(68,31,'2026-07-27 09:07:29',2),(69,31,'2026-07-27 09:07:32',2),(70,31,'2026-07-27 09:07:34',2),(71,31,'2026-07-27 09:07:36',2),(72,31,'2026-07-27 09:07:39',2),(73,31,'2026-07-27 09:07:41',2),(74,31,'2026-07-27 09:07:43',2),(75,31,'2026-07-27 09:07:46',2),(76,31,'2026-07-27 09:07:49',2),(77,31,'2026-07-27 09:07:51',2),(78,31,'2026-07-27 09:07:53',2),(79,31,'2026-07-27 09:07:55',2),(80,31,'2026-07-27 09:07:58',2),(81,31,'2026-07-27 09:08:00',2),(82,31,'2026-07-27 09:08:02',2),(83,31,'2026-07-27 09:08:06',2),(84,31,'2026-07-27 09:08:08',2),(85,31,'2026-07-27 09:08:10',2),(86,31,'2026-07-27 09:08:12',2),(87,31,'2026-07-27 09:08:15',2),(88,31,'2026-07-27 09:08:17',2),(89,31,'2026-07-27 09:08:21',2),(90,31,'2026-07-27 09:08:24',2),(91,31,'2026-07-27 09:08:26',2),(92,31,'2026-07-27 09:08:29',2),(93,31,'2026-07-27 09:08:31',2),(94,31,'2026-07-27 09:08:33',2),(95,31,'2026-07-27 09:08:35',2),(96,31,'2026-07-27 09:08:38',2),(97,31,'2026-07-27 09:08:40',2),(98,31,'2026-07-27 09:08:42',2),(99,31,'2026-07-27 09:08:44',2),(100,31,'2026-07-27 09:08:47',2),(101,31,'2026-07-27 09:08:50',2),(102,31,'2026-07-27 09:08:52',2),(103,31,'2026-07-27 09:08:56',2),(104,31,'2026-07-27 09:08:58',2),(105,31,'2026-07-27 09:09:00',2),(106,31,'2026-07-27 09:09:02',2),(107,31,'2026-07-27 09:09:05',2),(108,31,'2026-07-27 09:09:07',2),(109,31,'2026-07-27 09:09:09',2),(110,31,'2026-07-27 09:09:12',2),(111,31,'2026-07-27 09:09:14',2),(112,31,'2026-07-27 09:09:16',2),(113,31,'2026-07-27 09:09:18',2),(114,31,'2026-07-27 09:09:21',2),(115,31,'2026-07-27 09:09:23',2),(116,31,'2026-07-27 09:09:27',2),(117,31,'2026-07-27 09:09:29',2),(118,31,'2026-07-27 09:09:31',2),(119,31,'2026-07-27 09:09:34',2),(120,31,'2026-07-27 09:09:36',2),(121,31,'2026-07-27 09:09:39',2),(122,31,'2026-07-27 09:09:41',2),(123,31,'2026-07-27 09:09:44',2),(124,31,'2026-07-27 09:09:46',2),(125,31,'2026-07-27 09:09:48',2),(126,31,'2026-07-27 09:09:50',2),(127,31,'2026-07-27 09:09:52',2),(128,31,'2026-07-27 09:09:55',2),(129,31,'2026-07-27 09:09:57',2),(130,31,'2026-07-27 09:09:59',2),(131,31,'2026-07-27 09:10:02',2),(132,31,'2026-07-27 09:10:04',2),(133,31,'2026-07-27 09:10:07',2),(134,31,'2026-07-27 09:10:09',2),(135,31,'2026-07-27 09:10:12',2),(136,31,'2026-07-27 09:10:14',2),(137,31,'2026-07-27 09:10:17',2),(138,31,'2026-07-27 09:10:19',2),(139,31,'2026-07-27 09:10:21',2),(140,31,'2026-07-27 09:10:24',2),(141,31,'2026-07-27 09:10:26',2),(142,31,'2026-07-27 09:10:29',2),(143,31,'2026-07-27 09:10:31',2),(144,31,'2026-07-27 09:10:34',2),(145,31,'2026-07-27 09:10:36',2),(146,31,'2026-07-27 09:10:38',2),(147,31,'2026-07-27 09:10:40',2),(148,31,'2026-07-27 09:10:43',2),(149,31,'2026-07-27 09:10:46',2),(150,31,'2026-07-27 09:10:48',2),(151,31,'2026-07-27 09:10:50',2),(152,31,'2026-07-27 09:10:52',2),(153,31,'2026-07-27 09:10:56',2),(154,31,'2026-07-27 09:10:58',2),(155,31,'2026-07-27 09:11:00',2),(156,31,'2026-07-27 09:11:03',2),(157,31,'2026-07-27 09:11:05',2),(158,31,'2026-07-27 09:11:07',2),(159,31,'2026-07-27 09:11:10',2),(160,31,'2026-07-27 09:11:12',2),(161,31,'2026-07-27 09:11:15',2),(162,31,'2026-07-27 09:11:17',2),(163,31,'2026-07-27 09:11:20',2),(164,31,'2026-07-27 09:11:22',2),(165,31,'2026-07-27 09:11:25',2),(166,31,'2026-07-27 09:11:27',2),(167,31,'2026-07-27 09:11:29',2),(168,31,'2026-07-27 09:11:32',2),(169,31,'2026-07-27 09:11:34',2),(170,31,'2026-07-27 09:11:36',2),(171,31,'2026-07-27 09:11:38',2),(172,31,'2026-07-27 09:11:41',2),(173,31,'2026-07-27 09:11:43',2),(174,31,'2026-07-27 09:11:46',2),(175,31,'2026-07-27 09:11:48',2),(176,31,'2026-07-27 09:11:51',2),(177,31,'2026-07-27 09:11:53',2),(178,31,'2026-07-27 09:11:55',2),(179,31,'2026-07-27 09:11:57',2),(180,31,'2026-07-27 09:11:59',2),(181,31,'2026-07-27 09:12:02',2),(182,31,'2026-07-27 09:12:04',2),(183,31,'2026-07-27 09:12:06',2),(184,31,'2026-07-27 09:12:09',2),(185,31,'2026-07-27 09:12:11',2),(186,31,'2026-07-27 09:12:14',2),(187,31,'2026-07-27 09:12:16',2),(188,31,'2026-07-27 09:12:19',2),(189,31,'2026-07-27 09:12:22',2),(190,31,'2026-07-27 09:12:24',2),(191,31,'2026-07-27 09:12:27',2),(192,31,'2026-07-27 09:12:29',2),(193,31,'2026-07-27 09:12:33',2),(194,31,'2026-07-27 09:12:35',2),(195,31,'2026-07-27 09:12:37',2),(196,31,'2026-07-27 09:12:40',2),(197,31,'2026-07-27 09:12:42',2),(198,31,'2026-07-27 09:12:44',2),(199,31,'2026-07-27 09:12:46',2),(200,31,'2026-07-27 09:12:50',2),(201,31,'2026-07-27 09:12:52',2),(202,31,'2026-07-27 09:12:55',2),(203,31,'2026-07-27 09:12:57',2),(204,31,'2026-07-27 09:12:59',2),(205,31,'2026-07-27 09:13:01',2),(206,31,'2026-07-27 09:13:04',2),(207,31,'2026-07-27 09:13:07',2),(208,31,'2026-07-27 09:13:09',2),(209,31,'2026-07-27 09:13:12',2),(210,31,'2026-07-27 09:13:15',2),(211,31,'2026-07-27 09:13:17',2),(212,31,'2026-07-27 09:13:19',2),(213,31,'2026-07-27 09:13:22',2),(214,31,'2026-07-27 09:13:24',2),(215,31,'2026-07-27 09:13:27',2),(216,31,'2026-07-27 09:13:29',2),(217,31,'2026-07-27 09:13:31',2),(218,31,'2026-07-27 09:13:34',2),(219,31,'2026-07-27 09:13:36',2),(220,31,'2026-07-27 09:13:38',2),(221,31,'2026-07-27 09:13:42',2),(222,31,'2026-07-27 09:13:44',2),(223,31,'2026-07-27 09:13:46',2),(224,31,'2026-07-27 09:13:49',2),(225,31,'2026-07-27 09:13:51',2),(226,31,'2026-07-27 09:13:54',2),(227,31,'2026-07-27 09:13:56',2),(228,31,'2026-07-27 09:13:58',2),(229,31,'2026-07-27 09:14:00',2),(230,31,'2026-07-27 09:14:03',2),(231,31,'2026-07-27 09:14:05',2),(232,31,'2026-07-27 09:14:08',2),(233,31,'2026-07-27 09:14:10',2),(234,31,'2026-07-27 09:14:12',2),(235,31,'2026-07-27 09:14:14',2),(236,31,'2026-07-27 09:14:18',2),(237,31,'2026-07-27 09:14:20',2),(238,31,'2026-07-27 09:14:24',2),(239,31,'2026-07-27 09:14:27',2),(240,31,'2026-07-27 09:14:29',2),(241,31,'2026-07-27 09:14:32',2),(242,31,'2026-07-27 09:14:35',2),(243,31,'2026-07-27 09:14:38',2),(244,31,'2026-07-27 09:14:40',2),(245,31,'2026-07-27 09:14:42',2),(246,31,'2026-07-27 09:14:45',2),(247,31,'2026-07-27 09:14:47',2),(248,31,'2026-07-27 09:14:49',2),(249,31,'2026-07-27 09:14:51',2),(250,31,'2026-07-27 09:14:54',2),(251,31,'2026-07-27 09:14:56',2),(252,31,'2026-07-27 09:14:58',2),(253,31,'2026-07-27 09:15:00',2),(254,31,'2026-07-27 09:15:03',2),(255,31,'2026-07-27 09:15:05',2),(256,31,'2026-07-27 09:15:07',2),(257,31,'2026-07-27 09:15:10',2),(258,31,'2026-07-27 09:15:13',2),(259,31,'2026-07-27 09:15:15',2),(260,31,'2026-07-27 09:15:18',2),(261,31,'2026-07-27 09:15:20',2),(262,31,'2026-07-27 09:15:22',2),(263,31,'2026-07-27 09:15:24',2),(264,31,'2026-07-27 09:15:26',2),(265,31,'2026-07-27 09:15:28',2),(266,31,'2026-07-27 09:15:31',2),(267,31,'2026-07-27 09:15:33',2),(268,31,'2026-07-27 09:15:36',2),(269,31,'2026-07-27 09:15:39',2),(270,31,'2026-07-27 09:15:42',2),(271,31,'2026-07-27 09:15:44',2),(272,31,'2026-07-27 09:15:46',2),(273,31,'2026-07-27 09:15:48',2),(274,31,'2026-07-27 09:15:50',2),(275,31,'2026-07-27 09:15:52',2),(276,31,'2026-07-27 09:15:55',2),(277,31,'2026-07-27 09:15:57',2),(278,31,'2026-07-27 09:15:59',2),(279,31,'2026-07-27 09:16:02',2),(280,31,'2026-07-27 09:16:04',2),(281,31,'2026-07-27 09:16:06',2),(282,31,'2026-07-27 09:16:08',2),(283,31,'2026-07-27 09:16:11',2),(284,31,'2026-07-27 09:16:13',2),(285,31,'2026-07-27 09:16:15',2),(286,31,'2026-07-27 09:16:17',2),(287,31,'2026-07-27 09:16:20',2),(288,31,'2026-07-27 09:16:22',2),(289,31,'2026-07-27 09:16:25',2),(290,31,'2026-07-27 09:16:27',2),(291,31,'2026-07-27 09:16:29',2),(292,31,'2026-07-27 09:16:32',2),(293,31,'2026-07-27 09:16:34',2),(294,31,'2026-07-27 09:16:36',2),(295,31,'2026-07-27 09:16:39',2),(296,31,'2026-07-27 09:16:41',2),(297,31,'2026-07-27 09:16:43',2),(298,31,'2026-07-27 09:16:45',2),(299,31,'2026-07-27 09:16:47',2),(300,31,'2026-07-27 09:16:49',2),(301,31,'2026-07-27 09:16:52',2),(302,31,'2026-07-27 09:16:54',2),(303,31,'2026-07-27 09:16:56',2),(304,31,'2026-07-27 09:16:58',2),(305,31,'2026-07-27 09:17:01',2),(306,31,'2026-07-27 09:17:03',2),(307,31,'2026-07-27 09:17:06',2),(308,31,'2026-07-27 09:17:08',2),(309,31,'2026-07-27 09:17:11',2),(310,31,'2026-07-27 09:17:13',2),(311,31,'2026-07-27 09:17:15',2),(312,31,'2026-07-27 09:17:18',2),(313,31,'2026-07-27 09:17:21',2),(314,31,'2026-07-27 09:17:23',2),(315,31,'2026-07-27 09:17:25',2),(316,31,'2026-07-27 09:17:28',2),(317,31,'2026-07-27 09:17:33',2),(318,31,'2026-07-27 09:17:35',2),(319,31,'2026-07-27 09:17:38',2),(320,31,'2026-07-27 09:17:41',2),(321,31,'2026-07-27 09:17:43',2),(322,31,'2026-07-27 09:17:45',2),(323,31,'2026-07-27 09:17:48',2),(324,31,'2026-07-27 09:17:50',2),(325,31,'2026-07-27 09:17:52',2),(326,31,'2026-07-27 09:17:54',2),(327,31,'2026-07-27 09:17:57',2),(328,31,'2026-07-27 09:18:00',2),(329,31,'2026-07-27 09:18:02',2),(330,31,'2026-07-27 09:18:04',2),(331,31,'2026-07-27 09:18:06',2),(332,31,'2026-07-27 09:18:08',2),(333,31,'2026-07-27 09:18:11',2),(334,31,'2026-07-27 09:18:13',2),(335,31,'2026-07-27 09:18:15',2),(336,31,'2026-07-27 09:18:17',2),(337,31,'2026-07-27 09:18:19',2),(338,31,'2026-07-27 09:18:22',2),(339,31,'2026-07-27 09:18:24',2),(340,31,'2026-07-27 09:18:26',2),(341,31,'2026-07-27 09:18:29',2),(342,31,'2026-07-27 09:18:31',2),(343,31,'2026-07-27 09:18:34',2),(344,31,'2026-07-27 09:18:36',2),(345,31,'2026-07-27 09:18:39',2),(346,31,'2026-07-27 09:18:41',2),(347,31,'2026-07-27 09:18:43',2),(348,31,'2026-07-27 09:18:45',2),(349,31,'2026-07-27 09:18:49',2),(350,31,'2026-07-27 09:18:51',2),(351,31,'2026-07-27 09:18:53',2),(352,31,'2026-07-27 09:18:56',2),(353,31,'2026-07-27 09:18:58',2),(354,31,'2026-07-27 09:19:00',2),(355,31,'2026-07-27 09:19:03',2),(356,31,'2026-07-27 09:19:05',2),(357,31,'2026-07-27 09:19:07',2),(358,31,'2026-07-27 09:19:09',2),(359,31,'2026-07-27 09:19:12',2),(360,31,'2026-07-27 09:19:14',2),(361,31,'2026-07-27 09:19:17',2),(362,31,'2026-07-27 09:19:19',2),(363,31,'2026-07-27 09:19:23',2),(364,31,'2026-07-27 09:19:25',2),(365,31,'2026-07-27 09:19:28',2),(366,31,'2026-07-27 09:19:30',2),(367,31,'2026-07-27 09:19:32',2),(368,31,'2026-07-27 09:19:35',2),(369,31,'2026-07-27 09:19:37',2),(370,31,'2026-07-27 09:19:40',2),(371,31,'2026-07-27 09:19:42',2),(372,31,'2026-07-27 09:19:45',2),(373,31,'2026-07-27 09:19:49',2),(374,31,'2026-07-27 09:19:52',2),(375,31,'2026-07-27 09:19:54',2),(376,31,'2026-07-27 09:19:57',2),(377,31,'2026-07-27 09:19:59',2),(378,31,'2026-07-27 09:20:02',2),(379,31,'2026-07-27 09:20:04',2),(380,31,'2026-07-27 09:20:06',2),(381,31,'2026-07-27 09:20:09',2),(382,31,'2026-07-27 09:20:11',2),(383,31,'2026-07-27 09:20:14',2),(384,31,'2026-07-27 09:20:16',2),(385,31,'2026-07-27 09:20:19',2),(386,31,'2026-07-27 09:20:21',2),(387,31,'2026-07-27 09:20:23',2),(388,31,'2026-07-27 09:20:25',2),(389,31,'2026-07-27 09:20:28',2),(390,31,'2026-07-27 09:20:31',2),(391,31,'2026-07-27 09:20:33',2),(392,31,'2026-07-27 09:20:35',2),(393,31,'2026-07-27 09:20:37',2),(394,31,'2026-07-27 09:20:39',2),(395,31,'2026-07-27 09:20:42',2),(396,31,'2026-07-27 09:20:44',2),(397,31,'2026-07-27 09:20:47',2),(398,31,'2026-07-27 09:20:49',2),(399,31,'2026-07-27 09:20:51',2),(400,31,'2026-07-27 09:20:54',2),(401,31,'2026-07-27 09:20:56',2),(402,31,'2026-07-27 09:20:59',2),(403,31,'2026-07-27 09:21:01',2),(404,31,'2026-07-27 09:21:05',2),(405,31,'2026-07-27 09:21:07',2),(406,31,'2026-07-27 09:21:10',2),(407,31,'2026-07-27 09:21:12',2),(408,31,'2026-07-27 09:21:14',2),(409,31,'2026-07-27 09:21:17',2),(410,31,'2026-07-27 09:21:19',2),(411,31,'2026-07-27 09:21:21',2),(412,31,'2026-07-27 09:21:23',2),(413,31,'2026-07-27 09:21:26',2),(414,31,'2026-07-27 09:21:28',2),(415,31,'2026-07-27 09:21:31',2),(416,31,'2026-07-27 09:21:34',2),(417,31,'2026-07-27 09:21:37',2),(418,31,'2026-07-27 09:21:39',2),(419,31,'2026-07-27 09:21:41',2),(420,31,'2026-07-27 09:21:43',2),(421,31,'2026-07-27 09:21:45',2),(422,31,'2026-07-27 09:21:48',2),(423,31,'2026-07-27 09:21:50',2),(424,31,'2026-07-27 09:21:52',2),(425,31,'2026-07-27 09:21:54',2),(426,31,'2026-07-27 09:21:56',2),(427,31,'2026-07-27 09:21:59',2),(428,31,'2026-07-27 09:22:02',2),(429,31,'2026-07-27 09:22:05',2),(430,31,'2026-07-27 09:22:08',2),(431,31,'2026-07-27 09:22:10',2),(432,31,'2026-07-27 09:22:13',2),(433,31,'2026-07-27 09:22:16',2),(434,31,'2026-07-27 09:22:19',2),(435,31,'2026-07-27 09:22:21',2),(436,31,'2026-07-27 09:22:23',2),(437,31,'2026-07-27 09:22:25',2),(438,31,'2026-07-27 09:22:28',2),(439,31,'2026-07-27 09:22:30',2),(440,31,'2026-07-27 09:22:32',2),(441,31,'2026-07-27 09:22:35',2),(442,31,'2026-07-27 09:22:37',2),(443,31,'2026-07-27 09:22:40',2),(444,31,'2026-07-27 09:22:42',2),(445,31,'2026-07-27 09:22:44',2),(446,31,'2026-07-27 09:22:46',2),(447,31,'2026-07-27 09:22:49',2),(448,31,'2026-07-27 09:22:51',2),(449,31,'2026-07-27 09:22:54',2),(450,31,'2026-07-27 09:22:56',2),(451,31,'2026-07-27 09:22:59',2),(452,31,'2026-07-27 09:23:04',2),(453,31,'2026-07-27 09:23:07',2),(454,31,'2026-07-27 09:23:09',2),(455,31,'2026-07-27 09:23:12',2),(456,31,'2026-07-27 09:23:14',2),(457,31,'2026-07-27 09:23:16',2),(458,31,'2026-07-27 09:23:18',2),(459,31,'2026-07-27 09:23:21',2),(460,31,'2026-07-27 09:23:23',2),(461,31,'2026-07-27 09:23:25',2),(462,31,'2026-07-27 09:23:28',2),(463,31,'2026-07-27 09:23:30',2),(464,31,'2026-07-27 09:23:32',2),(465,31,'2026-07-27 09:23:35',2),(466,31,'2026-07-27 09:23:37',2),(467,31,'2026-07-27 09:23:39',2),(468,31,'2026-07-27 09:23:42',2),(469,31,'2026-07-27 09:23:46',2),(470,31,'2026-07-27 09:23:49',2),(471,31,'2026-07-27 09:23:52',2),(472,31,'2026-07-27 09:23:55',2),(473,31,'2026-07-27 09:23:57',2),(474,31,'2026-07-27 09:24:00',2),(475,31,'2026-07-27 09:24:03',2),(476,31,'2026-07-27 09:24:05',2),(477,31,'2026-07-27 09:24:08',2),(478,31,'2026-07-27 09:24:10',2),(479,31,'2026-07-27 09:24:12',2),(480,31,'2026-07-27 09:24:15',2),(481,31,'2026-07-27 09:24:17',2),(482,31,'2026-07-27 09:24:20',2),(483,31,'2026-07-27 09:24:22',2),(484,31,'2026-07-27 09:24:24',2),(485,31,'2026-07-27 09:24:26',2),(486,31,'2026-07-27 09:24:28',2),(487,31,'2026-07-27 09:24:31',2),(488,31,'2026-07-27 09:24:33',2),(489,31,'2026-07-27 09:24:35',2),(490,31,'2026-07-27 09:24:37',2),(491,31,'2026-07-27 09:24:41',2),(492,31,'2026-07-27 09:24:43',2),(493,31,'2026-07-27 09:24:45',2),(494,31,'2026-07-27 09:24:48',2),(495,31,'2026-07-27 09:24:50',2),(496,31,'2026-07-27 09:24:53',2),(497,31,'2026-07-27 09:24:55',2),(498,31,'2026-07-27 09:24:57',2),(499,31,'2026-07-27 09:24:59',2),(500,31,'2026-07-27 09:25:02',2),(501,31,'2026-07-27 09:25:04',2),(502,31,'2026-07-27 09:25:06',2),(503,31,'2026-07-27 09:25:08',2),(504,31,'2026-07-27 09:25:10',2),(505,31,'2026-07-27 09:25:12',2),(506,31,'2026-07-27 09:25:15',2),(507,31,'2026-07-27 09:25:18',2),(508,31,'2026-07-27 09:25:20',2),(509,31,'2026-07-27 09:25:23',2),(510,31,'2026-07-27 09:25:25',2),(511,31,'2026-07-27 09:25:28',2),(512,31,'2026-07-27 09:25:30',2),(513,31,'2026-07-27 09:25:32',2),(514,31,'2026-07-27 09:25:35',2),(515,31,'2026-07-27 09:25:38',2),(516,31,'2026-07-27 09:25:40',2),(517,31,'2026-07-27 09:25:42',2),(518,31,'2026-07-27 09:25:46',2),(519,31,'2026-07-27 09:25:48',2),(520,31,'2026-07-27 09:25:50',2),(521,31,'2026-07-27 09:25:52',2),(522,31,'2026-07-27 09:25:55',2),(523,31,'2026-07-27 09:25:57',2),(524,31,'2026-07-27 09:25:59',2),(525,31,'2026-07-27 09:26:01',2),(526,31,'2026-07-27 09:26:04',2),(527,31,'2026-07-27 09:26:06',2),(528,31,'2026-07-27 09:26:09',2),(529,31,'2026-07-27 09:26:11',2),(530,31,'2026-07-27 09:26:13',2),(531,31,'2026-07-27 09:26:16',2),(532,31,'2026-07-27 09:35:12',2),(533,31,'2026-07-27 09:35:15',2),(534,31,'2026-07-27 09:35:17',2),(535,31,'2026-07-27 09:35:19',2),(536,31,'2026-07-27 09:35:22',2),(537,31,'2026-07-27 09:35:24',2),(538,31,'2026-07-27 09:35:26',2),(539,31,'2026-07-27 09:35:28',2),(540,31,'2026-07-27 09:35:30',2),(541,31,'2026-07-27 09:35:33',2),(542,31,'2026-07-27 09:35:35',2),(543,31,'2026-07-27 09:35:37',2),(544,31,'2026-07-27 09:35:40',2),(545,31,'2026-07-27 09:35:42',2),(546,31,'2026-07-27 09:35:44',2),(547,31,'2026-07-27 09:35:46',2),(548,31,'2026-07-27 09:35:49',2),(549,31,'2026-07-27 09:35:51',2),(550,31,'2026-07-27 09:35:53',2),(551,31,'2026-07-27 09:35:56',2),(552,31,'2026-07-27 09:35:59',2),(553,31,'2026-07-27 09:36:02',2),(554,31,'2026-07-27 09:36:04',2),(555,31,'2026-07-27 09:36:06',2),(556,31,'2026-07-27 09:36:09',2),(557,31,'2026-07-27 09:36:11',2),(558,31,'2026-07-27 09:36:13',2),(559,31,'2026-07-27 09:36:16',2),(560,31,'2026-07-27 09:36:18',2),(561,31,'2026-07-27 09:36:20',2),(562,31,'2026-07-27 09:36:22',2),(563,31,'2026-07-27 09:36:24',2),(564,31,'2026-07-27 09:36:26',2),(565,31,'2026-07-27 09:36:29',2),(566,31,'2026-07-27 09:36:31',2),(567,31,'2026-07-27 09:36:34',2),(568,31,'2026-07-27 09:36:36',2),(569,31,'2026-07-27 09:36:38',2),(570,31,'2026-07-27 09:36:41',2),(571,31,'2026-07-27 09:36:43',2),(572,31,'2026-07-27 09:36:46',2),(573,31,'2026-07-27 09:36:48',2),(574,31,'2026-07-27 09:36:50',2),(575,31,'2026-07-27 09:36:52',2),(576,31,'2026-07-27 09:36:55',2),(577,31,'2026-07-27 09:36:58',2),(578,31,'2026-07-27 09:37:01',2),(579,31,'2026-07-27 09:37:03',2),(580,31,'2026-07-27 09:37:06',2),(581,31,'2026-07-27 09:37:08',2),(582,31,'2026-07-27 09:37:10',2),(583,31,'2026-07-27 09:37:13',2),(584,31,'2026-07-27 09:37:15',2),(585,31,'2026-07-27 09:37:17',2),(586,31,'2026-07-27 09:37:20',2),(587,31,'2026-07-27 09:37:22',2),(588,31,'2026-07-27 09:37:24',2),(589,31,'2026-07-27 09:37:27',2),(590,31,'2026-07-27 09:37:29',2),(591,31,'2026-07-27 09:37:31',2),(592,31,'2026-07-27 09:37:34',2),(593,31,'2026-07-27 09:37:36',2),(594,31,'2026-07-27 09:37:38',2),(595,31,'2026-07-27 09:37:41',2),(596,31,'2026-07-27 09:37:44',2),(597,31,'2026-07-27 09:37:46',2),(598,31,'2026-07-27 09:37:48',2),(599,31,'2026-07-27 09:37:51',2),(600,31,'2026-07-27 09:37:53',2),(601,31,'2026-07-27 09:37:55',2),(602,31,'2026-07-27 09:37:57',2),(603,31,'2026-07-27 09:38:00',2),(604,31,'2026-07-27 09:38:02',2),(605,31,'2026-07-27 09:38:04',2),(606,31,'2026-07-27 09:38:07',2),(607,31,'2026-07-27 09:38:09',2),(608,31,'2026-07-27 09:38:12',2),(609,31,'2026-07-27 09:38:14',2),(610,31,'2026-07-27 09:38:16',2),(611,31,'2026-07-27 09:38:19',2),(612,31,'2026-07-27 09:38:21',2),(613,31,'2026-07-27 09:38:23',2),(614,31,'2026-07-27 09:38:25',2),(615,31,'2026-07-27 09:38:28',2),(616,31,'2026-07-27 09:38:30',2),(617,31,'2026-07-27 09:38:33',2),(618,31,'2026-07-27 09:38:35',2),(619,31,'2026-07-27 09:38:38',2),(620,31,'2026-07-27 09:38:41',2),(621,31,'2026-07-27 09:38:43',2),(622,31,'2026-07-27 09:38:45',2),(623,31,'2026-07-27 09:38:48',2),(624,31,'2026-07-27 09:38:50',2),(625,31,'2026-07-27 09:38:52',2),(626,31,'2026-07-27 09:38:55',2),(627,31,'2026-07-27 09:38:59',2),(628,31,'2026-07-27 09:39:01',2),(629,31,'2026-07-27 09:39:04',2),(630,31,'2026-07-27 09:39:06',2),(631,31,'2026-07-27 09:39:08',2),(632,31,'2026-07-27 09:39:11',2),(633,31,'2026-07-27 09:39:15',2),(634,31,'2026-07-27 09:39:17',2),(635,31,'2026-07-27 09:39:19',2),(636,31,'2026-07-27 09:39:23',2),(637,31,'2026-07-27 09:39:25',2),(638,31,'2026-07-27 09:39:28',2),(639,31,'2026-07-27 09:39:30',2),(640,31,'2026-07-27 09:39:33',2),(641,31,'2026-07-27 09:39:36',2),(642,31,'2026-07-27 09:39:38',2),(643,31,'2026-07-27 09:39:40',2),(644,31,'2026-07-27 09:39:44',2),(645,31,'2026-07-27 09:39:46',2),(646,31,'2026-07-27 09:39:49',2),(647,31,'2026-07-27 09:39:51',2),(648,31,'2026-07-27 09:39:54',2),(649,31,'2026-07-27 09:39:56',2),(650,31,'2026-07-27 09:39:59',2),(651,31,'2026-07-27 09:40:02',2),(652,31,'2026-07-27 09:40:05',2),(653,31,'2026-07-27 09:40:07',2),(654,31,'2026-07-27 09:40:10',2),(655,31,'2026-07-27 09:40:12',2),(656,31,'2026-07-27 09:40:14',2),(657,31,'2026-07-27 09:40:17',2),(658,31,'2026-07-27 09:40:19',2),(659,31,'2026-07-27 09:40:22',2),(660,31,'2026-07-27 09:40:24',2),(661,31,'2026-07-27 09:40:26',2),(662,31,'2026-07-27 09:40:29',2),(663,31,'2026-07-27 09:40:31',2),(664,31,'2026-07-27 09:40:34',2),(665,31,'2026-07-27 09:40:36',2),(666,31,'2026-07-27 09:40:39',2),(667,31,'2026-07-27 09:40:41',2),(668,31,'2026-07-27 09:40:44',2),(669,31,'2026-07-27 09:40:46',2),(670,31,'2026-07-27 09:40:48',2),(671,31,'2026-07-27 09:40:51',2),(672,31,'2026-07-27 09:40:53',2),(673,31,'2026-07-27 09:40:55',2),(674,31,'2026-07-27 09:40:57',2),(675,31,'2026-07-27 09:41:00',2),(676,31,'2026-07-27 09:41:02',2),(677,31,'2026-07-27 09:41:05',2),(678,31,'2026-07-27 09:41:07',2),(679,31,'2026-07-27 09:41:10',2),(680,31,'2026-07-27 09:41:12',2),(681,31,'2026-07-27 09:41:14',2),(682,31,'2026-07-27 09:41:17',2),(683,31,'2026-07-27 09:41:19',2),(684,31,'2026-07-27 09:41:21',2),(685,31,'2026-07-27 09:41:23',2),(686,31,'2026-07-27 09:41:25',2),(687,31,'2026-07-27 09:41:27',2),(688,31,'2026-07-27 09:41:29',2),(689,31,'2026-07-27 09:41:32',2),(690,31,'2026-07-27 09:41:34',2),(691,31,'2026-07-27 09:41:37',2),(692,31,'2026-07-27 09:41:39',2),(693,31,'2026-07-27 09:41:41',2),(694,31,'2026-07-27 09:41:43',2),(695,31,'2026-07-27 09:41:46',2),(696,31,'2026-07-27 09:41:48',2),(697,31,'2026-07-27 09:41:51',2),(698,31,'2026-07-27 09:41:53',2),(699,31,'2026-07-27 09:41:55',2),(700,31,'2026-07-27 09:41:57',2),(701,31,'2026-07-27 09:42:00',2),(702,31,'2026-07-27 09:42:02',2),(703,31,'2026-07-27 09:42:04',2),(704,31,'2026-07-27 09:42:06',2),(705,31,'2026-07-27 09:42:09',2),(706,31,'2026-07-27 09:42:11',2),(707,31,'2026-07-27 09:42:14',2),(708,31,'2026-07-27 09:42:16',2),(709,31,'2026-07-27 09:42:19',2),(710,31,'2026-07-27 09:42:22',2),(711,31,'2026-07-27 09:42:24',2),(712,31,'2026-07-27 09:42:27',2),(713,31,'2026-07-27 09:42:30',2),(714,31,'2026-07-27 09:42:32',2),(715,31,'2026-07-27 09:42:35',2),(716,31,'2026-07-27 09:42:37',2),(717,31,'2026-07-27 09:42:40',2),(718,31,'2026-07-27 09:42:42',2),(719,31,'2026-07-27 09:42:45',2),(720,31,'2026-07-27 09:42:49',2),(721,31,'2026-07-27 09:42:51',2),(722,31,'2026-07-27 09:42:53',2),(723,31,'2026-07-27 09:42:55',2),(724,31,'2026-07-27 09:42:58',2),(725,31,'2026-07-27 09:43:00',2),(726,31,'2026-07-27 09:43:03',2),(727,31,'2026-07-27 09:43:05',2),(728,31,'2026-07-27 09:43:07',2),(729,31,'2026-07-27 09:43:10',2),(730,31,'2026-07-27 09:43:12',2),(731,31,'2026-07-27 09:43:14',2),(732,31,'2026-07-27 09:43:17',2),(733,31,'2026-07-27 09:43:19',2),(734,31,'2026-07-27 09:43:21',2),(735,31,'2026-07-27 09:43:24',2),(736,31,'2026-07-27 09:43:26',2),(737,31,'2026-07-27 09:43:29',2),(738,31,'2026-07-27 09:43:32',2),(739,31,'2026-07-27 09:43:34',2),(740,31,'2026-07-27 09:43:36',2),(741,31,'2026-07-27 09:43:39',2),(742,31,'2026-07-27 09:43:42',2),(743,31,'2026-07-27 09:43:45',2),(744,31,'2026-07-27 09:44:00',2),(745,31,'2026-07-27 09:44:03',2),(746,31,'2026-07-27 09:44:05',2),(747,31,'2026-07-27 09:44:20',2),(748,31,'2026-07-27 09:44:26',2),(749,31,'2026-07-27 09:44:35',2),(750,31,'2026-07-27 09:46:10',2),(751,31,'2026-07-27 09:50:28',2),(752,31,'2026-07-27 09:57:38',2),(753,31,'2026-07-27 09:58:07',2),(754,31,'2026-07-27 10:04:17',2),(755,31,'2026-07-27 10:04:27',2),(756,31,'2026-07-27 10:04:51',2),(757,31,'2026-07-27 10:04:57',2),(758,31,'2026-07-27 10:06:15',2);
/*!40000 ALTER TABLE `monitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `page_id` varchar(36) NOT NULL,
  `parent_page` varchar(36) DEFAULT NULL,
  `page_name` varchar(255) NOT NULL,
  `page_path` varchar(255) NOT NULL,
  `page_icon` varchar(255) DEFAULT NULL,
  `page_component` varchar(255) DEFAULT NULL,
  `page_order` int NOT NULL,
  `can_edit` int DEFAULT '1',
  `is_out_site` tinyint(1) DEFAULT '0' COMMENT '是否外链',
  `out_site_link` varchar(255) DEFAULT NULL COMMENT '外链地址',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `pages_pk_2` (`page_id`),
  KEY `pages_parent_page_fk` (`parent_page`),
  CONSTRAINT `pages_parent_page_fk` FOREIGN KEY (`parent_page`) REFERENCES `pages` (`page_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES ('1767758404441442','6aa57186ec6511f08b77f25c636de9ee','资产盘点','/iot/inventory-detail','AimOutlined','InventoryDetail',2,1,0,NULL,'2025-06-08 10:30:00','2026-01-08 07:41:17',NULL),('186756320915886080','6aa57186ec6511f08b77f25c636de9ee','资产列表','/asset','AlignRightOutlined','Asset',1,1,0,NULL,'2025-05-30 08:22:56','2026-01-08 07:44:24',NULL),('187796622602670080',NULL,'出入库管理','/io-record','AppstoreOutlined','xx',13,1,0,NULL,'2025-06-02 05:16:43','2026-01-08 06:43:05',NULL),('187796749966905344',NULL,'场库管理','/site','AndroidFilled','xx',14,1,0,NULL,'2025-06-02 05:17:14','2026-01-08 06:43:11',NULL),('187807279746125824','187796749966905344','园区管理','/site/garden','AccountBookFilled','Garden',1,1,0,NULL,'2025-06-02 07:45:03','2025-06-04 05:25:33',NULL),('187807398822416384','187796749966905344','场库信息','/site/store','AccountBookFilled','Store',2,1,0,NULL,'2025-06-02 07:45:31','2025-06-04 05:25:41',NULL),('188518807294185472','187796622602670080','出入库盘点','/io-record/ledger','BarsOutlined','IoRecordLedger',1,1,0,NULL,'2025-06-04 05:06:26','2026-01-08 06:53:09',NULL),('188524722328178688','187796622602670080','出入库面板','/io-record/panel','AccountBookFilled','panel',2,1,0,NULL,'2025-06-04 05:29:56','2025-06-04 05:29:56',NULL),('188525142412890112','187796622602670080','蜂鸣器报警规则','/io-record/buzzer','AccountBookFilled','Buzzer',3,1,0,NULL,'2025-06-04 05:31:36','2025-06-04 05:31:36',NULL),('188611286865547264',NULL,'统计分析','/analysis','AuditOutlined','Analysis',15,1,0,NULL,'2025-06-04 11:13:55','2026-01-08 06:43:17',NULL),('188611995858112512','188611286865547264','盘点分析','/analysis/asset','AccountBookFilled','xxx',1,1,0,NULL,'2025-06-04 11:16:44','2025-06-04 11:19:05',NULL),('188612252188807168','188611286865547264','流转统计','/analysis/flow','AccountBookFilled','xxx',2,1,0,NULL,'2025-06-04 11:17:45','2025-06-04 11:18:54',NULL),('188612496783839232','188611286865547264','资产状态统计','/analysis/status','AccountBookFilled','xxx',3,1,0,NULL,'2025-06-04 11:18:43','2025-06-04 11:18:43',NULL),('188888002213187584',NULL,'异常信息','/exception','BackwardFilled','Exception',16,1,0,NULL,'2025-06-05 05:33:29','2026-01-08 06:43:23',NULL),('188888218609913856','188888002213187584','疑似丢失/标签脱落','/exception/lost','AccountBookFilled','lost',1,1,0,NULL,'2025-06-05 05:34:20','2025-08-03 11:54:03',NULL),('188888422541168640','188888002213187584','流转异常','/exception/flow','AccountBookFilled','Flow',2,1,0,NULL,'2025-06-05 05:35:09','2025-06-05 05:35:09',NULL),('188933294094553088',NULL,'车辆监控','/vehicle/monitor','AppstoreTwoTone','monitor',17,1,0,NULL,'2025-06-05 08:33:27','2026-01-08 06:43:32',NULL),('188933408880070656','188933294094553088','监控','/monitor/monitor','AccountBookFilled','monitormonitor',1,1,0,NULL,'2025-06-05 08:33:54','2025-06-05 08:33:54',NULL),('188933591684616192','188933294094553088','车辆','/monitor/vehicle','AccountBookFilled','MonitorVehicle',2,1,0,NULL,'2025-06-05 08:34:38','2025-06-05 08:34:38',NULL),('189639335119687680',NULL,'基础设置','/base','AntCloudOutlined','base',18,1,0,NULL,'2025-06-07 07:19:00','2026-01-08 06:43:39',NULL),('189639599142735872','189639335119687680','资产类型','/base/type','AccountBookFilled','type',2,1,0,NULL,'2025-06-07 07:20:03','2025-06-07 07:22:37',NULL),('189640185057644544','189639335119687680','资产部门','/base/department','AccountBookFilled','department',1,1,0,NULL,'2025-06-07 07:22:23','2025-06-07 07:22:23',NULL),('189690178095288320','189639335119687680','周转线路设置','/base/line','AccountBookFilled','baseLine',3,1,0,NULL,'2025-06-07 10:41:02','2025-06-07 10:41:02',NULL),('189690416130428928','189639335119687680','业务参数设置','/base/arg','AccountBookFilled','baseArg',4,1,0,NULL,'2025-06-07 10:41:59','2025-06-07 10:41:59',NULL),('189690655138648064','189639335119687680','告警通知设置','/base/notice','AccountBookFilled','baseNotice',5,1,0,NULL,'2025-06-07 10:42:56','2025-06-07 10:42:56',NULL),('190037519541211136',NULL,'IOT设备管理','/iot','BilibiliOutlined','iot',19,1,0,NULL,'2025-06-08 09:41:15','2026-01-08 06:43:44',NULL),('190037684654182400','190037519541211136','网关管理','/iot/gateway','AccountBookFilled','iotGateway',1,1,0,NULL,'2025-06-08 09:41:54','2025-06-08 09:41:54',NULL),('190047420074168320','190037519541211136','标签管理','/iot/tag','AccountBookFilled','iotTag',2,1,0,NULL,'2025-06-08 10:20:35','2025-06-08 10:20:35',NULL),('190427827726716928',NULL,'资产看板','/panel','DashboardFilled','panel',1,1,0,NULL,'2025-06-10 02:04:20','2026-01-08 06:42:43',NULL),('40351462613585920',NULL,'系统管理','/system','SettingOutlined','system',21,1,0,NULL,'2024-04-21 17:46:05','2025-07-18 09:03:20',NULL),('40351711566499840','40351462613585920','用户管理','/system/user','UserOutlined','user',1,1,0,'','2024-04-21 17:47:04','2025-07-03 10:57:19',NULL),('40352343601975296','40351462613585920','角色管理','/system/role','MergeOutlined','role',2,1,0,'','2024-04-21 17:49:35','2025-07-03 10:57:19',NULL),('40352749044371456','40351462613585920','部门管理','/system/department','ApartmentOutlined','department',3,1,0,'','2024-04-21 17:51:12','2025-07-03 10:57:19',NULL),('40708567220621312','40351462613585920','菜单管理','/system/menu','FolderOpenOutlined','menu',4,1,0,'','2024-04-22 16:01:18','2025-07-03 10:57:19',NULL),('47973248603787264',NULL,'文件管理','/file','CloudUploadOutlined','File',3,1,0,NULL,'2024-05-12 17:08:33','2025-07-03 10:57:19',NULL),('47975943540576256',NULL,'系统监控','/monitor','CodeOutlined','Monitor',20,1,0,NULL,'2024-05-12 17:19:16','2025-07-18 09:03:32',NULL),('47989353607073792','47975943540576256','操作日志','/monitor/logs','FileDoneOutlined','Logs',1,1,0,NULL,'2024-05-13 09:20:50','2025-07-03 10:57:19',NULL),('47989749788446720','47973248603787264','大文件上传','/file/upload','CloudUploadOutlined','UploadFile',0,1,0,NULL,'2024-05-13 09:22:25','2025-07-03 10:57:19',NULL),('49387228375289856','47975943540576256','定时任务','/monitor/timeTask','ClockCircleOutlined','TimeTask',0,1,0,NULL,'2024-05-16 14:47:12','2025-07-03 10:57:19',NULL),('6aa57186ec6511f08b77f25c636de9ee',NULL,'资产管理','/asset-manage','AccountBookFilled','xx',11,1,0,NULL,'2026-01-08 07:41:17','2026-01-08 07:44:08',NULL),('82ae591aec6611f08b77f25c636de9ee','6aa57186ec6511f08b77f25c636de9ee','资产绑定','/asset/bind','AimOutlined','AssetBind',3,1,0,NULL,'2026-01-08 07:49:07','2026-01-08 07:50:07',NULL);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Deployment extension: 基础设置 / 班组信息
--

INSERT INTO `pages` (
  `page_id`,`parent_page`,`page_name`,`page_path`,`page_icon`,`page_component`,
  `page_order`,`can_edit`,`is_out_site`,`out_site_link`,`create_time`,`update_time`,`delete_time`
) VALUES (
  'base_group_info_20260727','189639335119687680','班组信息','/base/group',
  'TeamOutlined','baseGroup',6,1,0,NULL,'2026-07-27 00:00:00','2026-07-27 00:00:00',NULL
);

--
-- Table structure for table `rfid_tags`
--

DROP TABLE IF EXISTS `rfid_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rfid_tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag_code` varchar(100) DEFAULT NULL COMMENT 'RFID 标签码（唯一，如 EPC 编码）',
  `tag_type` varchar(100) DEFAULT NULL COMMENT '标签类型（如 normal、防拆、HF、LF）',
  `status` int DEFAULT NULL COMMENT '1:在线 2:离线 3:告警',
  `heartbeat` varchar(255) DEFAULT NULL COMMENT '心跳数据',
  `report_time` timestamp NULL DEFAULT NULL COMMENT '上报时间',
  `electricity` varchar(36) DEFAULT NULL COMMENT '标签电量',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_rfid_tag_code` (`tag_code`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='标签表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfid_tags`
--

LOCK TABLES `rfid_tags` WRITE;
/*!40000 ALTER TABLE `rfid_tags` DISABLE KEYS */;
INSERT INTO `rfid_tags` VALUES (6,'11022190',NULL,1,'gateway=2;rssi=67;antenna=0','2026-07-27 10:06:15','21'),(7,'11022181',NULL,1,NULL,NULL,'100'),(8,'11022185',NULL,1,NULL,NULL,'100'),(9,'11022189',NULL,1,NULL,NULL,'100'),(10,'11022183',NULL,1,NULL,NULL,'100'),(11,'11025644',NULL,1,NULL,NULL,'100');
/*!40000 ALTER TABLE `rfid_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` varchar(36) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `description` text,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` timestamp NULL DEFAULT NULL,
  `can_edit` int DEFAULT '1' COMMENT '是否可编辑删除',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `roles_pk` (`role_name`),
  UNIQUE KEY `roles_pk_2` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('204522831088717824','普通用户','普通用户','2025-07-18 09:00:42','2025-07-18 09:00:42',NULL,1),('37904208560656384','超级管理员','超级管理员，拥有所有权限，不可编辑和删除','2024-04-14 22:17:47','2024-05-09 15:29:08',NULL,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_interfaces`
--

DROP TABLE IF EXISTS `roles_interfaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_interfaces` (
  `role_id` varchar(36) NOT NULL,
  `interface_id` varchar(36) NOT NULL,
  KEY `roles_interfaces_interfaces_interface_id_fk` (`interface_id`),
  KEY `roles_interfaces_roles_role_id_fk` (`role_id`),
  CONSTRAINT `roles_interfaces_interfaces_interface_id_fk` FOREIGN KEY (`interface_id`) REFERENCES `interfaces` (`interface_id`) ON DELETE CASCADE,
  CONSTRAINT `roles_interfaces_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色接口中间表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_interfaces`
--

LOCK TABLES `roles_interfaces` WRITE;
/*!40000 ALTER TABLE `roles_interfaces` DISABLE KEYS */;
INSERT INTO `roles_interfaces` VALUES ('37904208560656384','37899586299236352'),('37904208560656384','37899744348999680'),('37904208560656384','40696216958275584'),('37904208560656384','41065294818447360'),('37904208560656384','41789444067430400'),('37904208560656384','41903454221766656'),('37904208560656384','41906647861301248'),('37904208560656384','42063400649363456'),('37904208560656384','42071947340681216'),('37904208560656384','42079060825739264'),('37904208560656384','44326032676753408'),('37904208560656384','44332995393359872'),('37904208560656384','44333062707744768'),('37904208560656384','44474438040686592'),('37904208560656384','45864670036234240'),('37904208560656384','46239031234662400'),('37904208560656384','46858901232029696'),('37904208560656384','46859015694585856'),('37904208560656384','46859424727306240'),('37904208560656384','46862379094380544'),('37904208560656384','46862511944765440'),('37904208560656384','46862830229524480'),('37904208560656384','46863099453509632'),('37904208560656384','46863346367991808'),('37904208560656384','46863589419520000'),('37904208560656384','47156442767036416'),('37904208560656384','47216551878725632'),('37904208560656384','47216745617821696'),('37904208560656384','47584267768696832'),('37904208560656384','47593342061514752'),('37904208560656384','47608622313639936'),('37904208560656384','47608882222075904'),('37904208560656384','47973984368594944'),('37904208560656384','47974191147782144'),('37904208560656384','47974424665657344'),('37904208560656384','47974555385335808'),('37904208560656384','47974732070391808'),('37904208560656384','47974990527598592'),('37904208560656384','47975191568977920'),('37904208560656384','47975597174951936'),('37904208560656384','47976243613667328'),('37904208560656384','49391522268844032'),('37904208560656384','49391714045005824'),('37904208560656384','49391851559456768'),('37904208560656384','49392003502313472');
/*!40000 ALTER TABLE `roles_interfaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_pages`
--

DROP TABLE IF EXISTS `roles_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_pages` (
  `role_id` varchar(36) NOT NULL,
  `page_id` varchar(36) NOT NULL,
  PRIMARY KEY (`role_id`,`page_id`),
  KEY `roles_pages_pages_page_id_fk` (`page_id`),
  KEY `roles_pages_roles_role_id_fk` (`role_id`),
  CONSTRAINT `roles_pages_pages_page_id_fk` FOREIGN KEY (`page_id`) REFERENCES `pages` (`page_id`) ON DELETE CASCADE,
  CONSTRAINT `roles_pages_roles_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_pages`
--

LOCK TABLES `roles_pages` WRITE;
/*!40000 ALTER TABLE `roles_pages` DISABLE KEYS */;
INSERT INTO `roles_pages` VALUES ('37904208560656384','186756320915886080'),('37904208560656384','187807279746125824'),('37904208560656384','187807398822416384'),('37904208560656384','188518807294185472'),('37904208560656384','188524722328178688'),('37904208560656384','188525142412890112'),('37904208560656384','188611995858112512'),('37904208560656384','188612252188807168'),('37904208560656384','188612496783839232'),('37904208560656384','188888218609913856'),('37904208560656384','188888422541168640'),('37904208560656384','188933408880070656'),('37904208560656384','188933591684616192'),('37904208560656384','189639599142735872'),('37904208560656384','189640185057644544'),('37904208560656384','189690178095288320'),('37904208560656384','189690416130428928'),('37904208560656384','189690655138648064'),('37904208560656384','190037684654182400'),('37904208560656384','190047420074168320'),('37904208560656384','40351711566499840'),('37904208560656384','40352343601975296'),('37904208560656384','40352749044371456'),('37904208560656384','40708567220621312'),('37904208560656384','47989353607073792'),('37904208560656384','47989749788446720'),('37904208560656384','49387228375289856'),('37904208560656384','40351462613585920'),('37904208560656384','47973248603787264'),('37904208560656384','47975943540576256'),('37904208560656384','187796622602670080'),('37904208560656384','187796749966905344'),('37904208560656384','188611286865547264'),('37904208560656384','188888002213187584'),('37904208560656384','188933294094553088'),('37904208560656384','189639335119687680'),('37904208560656384','190037519541211136'),('37904208560656384','190427827726716928'),('204522831088717824','190037519541211136'),('204522831088717824','190037684654182400'),('204522831088717824','190047420074168320'),('204522831088717824','189639335119687680'),('204522831088717824','189640185057644544'),('204522831088717824','189639599142735872'),('204522831088717824','189690178095288320'),('204522831088717824','189690416130428928'),('204522831088717824','189690655138648064'),('204522831088717824','188933294094553088'),('204522831088717824','188933408880070656'),('204522831088717824','188933591684616192'),('204522831088717824','188888002213187584'),('204522831088717824','188888218609913856'),('204522831088717824','188888422541168640'),('204522831088717824','188611286865547264'),('204522831088717824','188611995858112512'),('204522831088717824','188612252188807168'),('204522831088717824','188612496783839232'),('204522831088717824','187796749966905344'),('204522831088717824','187807279746125824'),('204522831088717824','187807398822416384'),('204522831088717824','187796622602670080'),('204522831088717824','188518807294185472'),('204522831088717824','188524722328178688'),('204522831088717824','188525142412890112'),('204522831088717824','186756320915886080'),('204522831088717824','190427827726716928'),('204522831088717824','40351462613585920'),('204522831088717824','40351711566499840'),('204522831088717824','40352343601975296'),('204522831088717824','40352749044371456'),('204522831088717824','40708567220621312'),('204522831088717824','47975943540576256'),('204522831088717824','49387228375289856'),('204522831088717824','47989353607073792'),('37904208560656384','1767758404441442'),('204522831088717824','1767758404441442'),('37904208560656384','6aa57186ec6511f08b77f25c636de9ee'),('204522831088717824','6aa57186ec6511f08b77f25c636de9ee'),('37904208560656384','82ae591aec6611f08b77f25c636de9ee'),('204522831088717824','82ae591aec6611f08b77f25c636de9ee');
/*!40000 ALTER TABLE `roles_pages` ENABLE KEYS */;
UNLOCK TABLES;

-- 已拥有“基础设置”权限的角色，同时获得“班组信息”权限。
INSERT IGNORE INTO `roles_pages` (`role_id`,`page_id`)
SELECT `role_id`, 'base_group_info_20260727'
FROM `roles_pages`
WHERE `page_id` = '189639335119687680';

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `store_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '场库编号',
  `garden_id` int DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='场库信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (2,'12号库',4),(3,'14号库',4);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT (now()),
  `update_time` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `delete_time` timestamp NULL DEFAULT NULL,
  `status` int DEFAULT '1',
  `department_id` varchar(36) DEFAULT NULL,
  `is_admin` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account` (`account`),
  KEY `users_department_id_fk` (`department_id`),
  CONSTRAINT `users_department_id_fk` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('34980631960096768','admin','$2a$10$xF3Zg4fby10w.pBjcsJA0.9eikP3agRF3PpBl9Dgw3xBI2MREXZ26','超级管理员',NULL,'2024-04-23 15:40:14','2025-12-25 09:09:59',NULL,1,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `user_id` varchar(36) NOT NULL,
  `role_id` varchar(36) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES ('34980631960096768','37904208560656384');
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-27 18:06:53
