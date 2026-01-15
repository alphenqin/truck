-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
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
  PRIMARY KEY (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'A001',1,1,'2026-01-08 09:55:46','2026-01-08 10:25:02',1,1),(2,'A002',3,2,'2026-01-08 09:55:46','2026-01-08 10:25:34',1,1),(3,'A003',1,3,'2026-01-08 09:55:46','2026-01-08 10:25:17',2,1),(4,'A004',5,6,'2026-01-08 09:55:46','2026-01-08 10:25:23',2,1),(5,'A005',1,5,'2026-01-08 09:55:46','2026-01-08 10:25:40',3,1),(6,'A006',3,1,'2026-01-08 09:55:46','2026-01-08 10:21:34',3,1),(7,'A007',1,7,'2026-01-08 09:55:46','2026-01-08 10:26:00',1,1),(8,'A008',2,1,'2026-01-08 09:55:46','2026-01-08 09:55:46',1,1),(9,'A009',1,1,'2026-01-08 09:55:46','2026-01-08 09:55:46',2,1),(10,'A010',2,4,'2026-01-08 09:55:46','2026-01-08 10:26:10',2,1),(11,'A011',1,1,'2026-01-08 09:55:46','2026-01-08 09:55:46',3,1),(12,'A012',2,1,'2026-01-08 09:55:46','2026-01-08 09:55:46',3,1),(18,'氛围灯',1,2,'2025-06-09 17:41:49','2026-01-08 03:12:35',NULL,NULL),(26,'12',1,2,'2025-06-09 17:46:29','2026-01-08 03:12:31',NULL,NULL),(27,'333',1,2,'2025-06-09 18:05:40','2026-01-08 03:12:27',NULL,33),(28,'34',1,3,'2025-06-09 18:26:46','2026-01-08 03:12:22',NULL,33),(29,'3213122',5,3,'2026-01-08 02:49:14','2026-01-08 09:12:13',NULL,222);
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
INSERT INTO `asset_groups` VALUES (6,2),(11,1),(12,1),(14,1),(15,1),(17,1),(18,3),(25,3),(26,4),(27,1),(28,2),(29,1);
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
INSERT INTO `asset_repairs` VALUES (1,29,'sss','2026-01-08 03:47:10');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_tags`
--

LOCK TABLES `asset_tags` WRITE;
/*!40000 ALTER TABLE `asset_tags` DISABLE KEYS */;
INSERT INTO `asset_tags` VALUES (1,18,1,'2026-01-08 07:24:24'),(2,26,3,'2026-01-08 07:24:24');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产和资产类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_types`
--

LOCK TABLES `asset_types` WRITE;
/*!40000 ALTER TABLE `asset_types` DISABLE KEYS */;
INSERT INTO `asset_types` VALUES (1,'工装车'),(3,'牵引车'),(5,'粑粑车');
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
INSERT INTO `departments` VALUES (1,'33',14),(3,'22',5),(4,'222',4),(5,'44',4);
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
INSERT INTO `gardens` VALUES (4,'一号园区'),(6,'二号园区'),(7,'五号园区');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='网关表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gateways`
--

LOCK TABLES `gateways` WRITE;
/*!40000 ALTER TABLE `gateways` DISABLE KEYS */;
INSERT INTO `gateways` VALUES (1,'网关1','111',1,NULL,NULL,1);
/*!40000 ALTER TABLE `gateways` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_stores`
--

DROP TABLE IF EXISTS `group_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_stores` (
  `group_id` int DEFAULT NULL COMMENT '班组ID',
  `store_id` int DEFAULT NULL COMMENT '场库ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班组与场库对应关系';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_stores`
--

LOCK TABLES `group_stores` WRITE;
/*!40000 ALTER TABLE `group_stores` DISABLE KEYS */;
INSERT INTO `group_stores` VALUES (2,4),(3,5),(4,4),(1,5),(1,5),(2,4),(3,5),(2,4),(1,5);
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
  `group_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`group_id`)
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
  KEY `idx_tag_code` (`tag_code`),
  KEY `idx_asset_id` (`asset_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_inventory_time` (`inventory_time`)
) ENGINE=InnoDB AUTO_INCREMENT=823 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='盘点记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_records`
--

LOCK TABLES `inventory_records` WRITE;
/*!40000 ALTER TABLE `inventory_records` DISABLE KEYS */;
INSERT INTO `inventory_records` VALUES (505,'TB0010410',6,2,1,'2026-01-07 23:26:51',-31,3,'47%','0.61',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(506,'TB0011864',7,2,2,'2026-01-07 23:24:52',-40,4,'48%','0.95',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(507,'TB0012910',4,1,1,'2026-01-07 23:08:52',-59,1,'96%','0.64',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(508,'TB0013619',8,3,1,'2026-01-07 23:26:05',-37,4,'92%','0.92',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(509,'TB0014481',10,1,2,'2026-01-07 23:01:27',-77,4,'63%','0.97',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(510,'TB0020670',4,1,2,'2026-01-07 23:15:07',-77,3,'44%','0.77',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(511,'TB0021948',9,3,1,'2026-01-07 23:47:38',-64,3,'98%','0.82',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(512,'TB0022196',10,3,2,'2026-01-07 23:10:21',-59,1,'43%','0.82',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(513,'TB0023379',8,3,1,'2026-01-07 23:29:47',-34,2,'59%','0.76',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(514,'TB0030677',9,3,1,'2026-01-07 23:01:39',-55,4,'86%','0.97',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(515,'TB0031357',3,3,1,'2026-01-07 23:11:12',-67,1,'93%','0.94',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(516,'TB0032423',6,1,1,'2026-01-07 23:51:56',-54,1,'84%','0.79',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(517,'TB0033591',2,3,1,'2026-01-07 23:42:25',-46,2,'54%','0.94',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(518,'TB0034920',5,1,2,'2026-01-07 23:36:10',-43,4,'92%','0.91',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(519,'TB0035628',11,2,1,'2026-01-07 23:35:26',-51,2,'54%','0.90',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(520,'TB0036472',10,1,2,'2026-01-07 23:52:12',-77,3,'77%','0.70',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(521,'TB0037420',6,1,1,'2026-01-07 23:14:39',-61,4,'62%','0.88',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(522,'TB0040635',1,1,1,'2026-01-07 23:33:06',-52,4,'68%','0.92',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(523,'TB0050563',1,2,2,'2026-01-07 23:35:30',-69,1,'92%','0.89',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(524,'TB0051316',1,2,1,'2026-01-07 23:48:21',-47,1,'41%','0.67',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(525,'TB0052408',10,1,1,'2026-01-07 23:45:57',-31,1,'69%','0.94',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(526,'TB0053130',7,1,2,'2026-01-07 23:55:41',-77,1,'52%','0.94',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(527,'TB0054455',9,3,2,'2026-01-07 23:17:22',-55,1,'73%','0.81',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(528,'TB0060134',11,3,2,'2026-01-07 23:53:50',-60,3,'47%','0.81',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(529,'TB0061349',8,2,2,'2026-01-07 23:34:53',-73,3,'55%','0.64',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(530,'TB0062801',4,2,2,'2026-01-07 23:26:19',-72,2,'72%','0.96',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(531,'TB0063185',7,2,2,'2026-01-07 23:50:18',-31,2,'82%','0.95',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(532,'TB0064647',6,2,2,'2026-01-07 23:10:37',-54,1,'79%','0.75',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(533,'TB0065254',4,2,2,'2026-01-07 23:57:45',-46,4,'88%','0.92',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(534,'TB0070356',9,1,2,'2026-01-07 23:15:31',-80,1,'61%','0.91',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(535,'TB0071627',7,1,1,'2026-01-07 23:27:05',-76,3,'44%','0.78',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(536,'TB0072573',6,1,1,'2026-01-07 23:58:48',-33,3,'59%','0.84',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(537,'TB0073626',11,1,2,'2026-01-07 23:58:36',-74,3,'55%','0.73',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(538,'TB0074478',12,2,2,'2026-01-07 23:34:55',-63,1,'59%','0.85',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(539,'TB0110112',1,3,1,'2026-01-08 00:56:20',-58,4,'65%','0.87',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(540,'TB0111409',8,1,2,'2026-01-08 00:16:44',-67,2,'53%','0.83',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(541,'TB0120882',11,2,1,'2026-01-08 00:12:14',-51,2,'62%','0.92',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(542,'TB0121855',8,3,1,'2026-01-08 00:37:30',-72,2,'96%','0.87',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(543,'TB0122511',7,2,2,'2026-01-08 00:14:43',-36,2,'60%','0.84',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(544,'TB0123604',1,2,1,'2026-01-08 00:54:11',-54,4,'46%','0.71',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(545,'TB0124583',3,1,1,'2026-01-08 00:01:16',-64,2,'42%','0.67',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(546,'TB0125189',5,3,2,'2026-01-08 00:28:03',-46,3,'81%','0.84',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(547,'TB0130134',11,1,2,'2026-01-08 00:51:36',-46,1,'85%','0.63',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(548,'TB0131459',8,1,1,'2026-01-08 00:18:39',-78,3,'63%','0.90',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(549,'TB0132876',8,2,1,'2026-01-08 00:21:51',-80,1,'62%','0.93',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(550,'TB0133217',10,3,1,'2026-01-08 00:54:24',-78,4,'100%','0.67',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(551,'TB0134247',11,1,2,'2026-01-08 00:47:29',-77,3,'41%','0.97',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(552,'TB0140325',5,3,2,'2026-01-08 00:08:30',-61,3,'75%','0.61',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(553,'TB0150749',8,1,2,'2026-01-08 00:24:00',-46,3,'87%','0.89',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(554,'TB0160761',8,2,1,'2026-01-08 00:05:34',-34,2,'88%','0.64',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(555,'TB0161139',3,3,1,'2026-01-08 00:20:43',-62,4,'90%','0.65',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(556,'TB0162490',1,2,2,'2026-01-08 00:52:48',-54,3,'76%','0.75',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(557,'TB0163514',10,1,1,'2026-01-08 00:32:47',-59,2,'82%','0.80',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(558,'TB0170316',10,1,1,'2026-01-08 00:50:59',-32,4,'53%','0.88',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(559,'TB0171547',10,1,1,'2026-01-08 00:23:52',-73,2,'40%','0.76',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(560,'TB0172989',12,2,2,'2026-01-08 00:56:16',-56,1,'74%','0.95',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(561,'TB0173124',11,3,2,'2026-01-08 00:49:00',-36,3,'91%','0.71',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(562,'TB0174776',6,3,1,'2026-01-08 00:37:38',-63,4,'99%','0.88',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(563,'TB0175240',8,3,1,'2026-01-08 00:08:01',-35,4,'98%','0.97',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(564,'TB0210484',11,3,2,'2026-01-08 01:11:24',-74,3,'52%','0.72',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(565,'TB0220579',6,1,2,'2026-01-08 01:01:38',-66,4,'84%','0.83',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(566,'TB0221557',8,1,1,'2026-01-08 01:45:46',-74,2,'71%','0.75',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(567,'TB0222629',12,3,2,'2026-01-08 01:06:16',-60,4,'56%','0.92',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(568,'TB0223923',5,3,1,'2026-01-08 01:00:28',-48,2,'53%','0.66',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(569,'TB0224831',1,1,2,'2026-01-08 01:22:07',-31,3,'54%','0.73',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(570,'TB0225965',10,3,1,'2026-01-08 01:11:10',-49,1,'85%','0.89',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(571,'TB0230654',8,3,1,'2026-01-08 01:21:33',-79,1,'44%','0.99',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(572,'TB0231693',7,3,1,'2026-01-08 01:18:48',-71,3,'51%','0.81',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(573,'TB0232848',6,2,2,'2026-01-08 01:10:58',-66,4,'92%','0.78',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(574,'TB0233823',7,1,1,'2026-01-08 01:47:40',-44,4,'98%','0.79',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(575,'TB0234747',1,3,2,'2026-01-08 01:34:19',-72,3,'42%','0.60',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(576,'TB0235202',2,2,1,'2026-01-08 01:19:50',-48,2,'98%','0.65',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(577,'TB0236965',10,2,2,'2026-01-08 01:10:31',-72,4,'92%','0.90',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(578,'TB0240528',1,1,1,'2026-01-08 01:14:51',-31,1,'66%','0.97',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(579,'TB0241705',5,3,1,'2026-01-08 01:30:17',-59,4,'49%','0.80',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(580,'TB0242837',8,2,2,'2026-01-08 01:17:04',-56,1,'73%','0.70',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(581,'TB0243109',4,3,1,'2026-01-08 01:43:21',-50,3,'47%','0.99',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(582,'TB0244364',9,2,2,'2026-01-08 01:40:23',-36,2,'42%','0.75',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(583,'TB0250538',1,2,2,'2026-01-08 01:04:48',-41,2,'88%','0.98',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(584,'TB0251379',9,2,1,'2026-01-08 01:56:16',-80,3,'100%','0.83',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(585,'TB0252850',4,3,1,'2026-01-08 01:44:37',-37,4,'42%','0.80',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(586,'TB0253708',6,1,1,'2026-01-08 01:39:49',-61,3,'75%','0.73',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(587,'TB0260197',5,3,2,'2026-01-08 01:23:27',-40,4,'74%','0.97',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(588,'TB0270683',12,1,2,'2026-01-08 01:19:03',-41,3,'47%','0.70',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(589,'TB0271307',4,2,2,'2026-01-08 01:03:12',-49,1,'44%','0.87',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(590,'TB0272831',12,3,1,'2026-01-08 01:28:37',-74,3,'71%','0.85',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(591,'TB0310518',8,1,1,'2026-01-08 02:00:33',-73,1,'57%','0.80',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(592,'TB0311297',3,3,1,'2026-01-08 02:52:50',-56,1,'93%','0.77',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(593,'TB0312364',3,2,1,'2026-01-08 02:13:12',-48,3,'97%','0.65',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(594,'TB0313407',11,3,2,'2026-01-08 02:40:30',-54,3,'77%','0.72',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(595,'TB0314347',5,2,2,'2026-01-08 02:44:15',-61,2,'52%','0.98',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(596,'TB0320328',5,1,1,'2026-01-08 02:34:21',-59,3,'83%','0.78',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(597,'TB0321640',7,2,1,'2026-01-08 02:23:25',-67,1,'79%','0.76',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(598,'TB0322452',4,1,2,'2026-01-08 02:36:26',-45,4,'100%','0.63',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(599,'TB0323799',4,1,1,'2026-01-08 02:11:12',-47,4,'60%','0.63',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(600,'TB0324247',6,2,1,'2026-01-08 02:08:32',-67,3,'95%','0.86',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(601,'TB0325194',12,2,2,'2026-01-08 02:45:40',-75,4,'93%','0.82',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(602,'TB0330249',12,2,2,'2026-01-08 02:13:20',-78,1,'50%','0.86',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(603,'TB0331160',10,1,2,'2026-01-08 02:03:58',-47,4,'84%','0.70',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(604,'TB0332477',6,2,1,'2026-01-08 02:57:38',-79,4,'71%','0.92',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(605,'TB0333796',6,1,1,'2026-01-08 02:11:01',-41,1,'50%','0.92',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(606,'TB0340720',4,1,2,'2026-01-08 02:30:50',-76,2,'41%','0.61',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(607,'TB0341700',3,3,1,'2026-01-08 02:00:58',-59,2,'60%','0.94',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(608,'TB0342591',10,1,1,'2026-01-08 02:01:03',-71,4,'88%','0.64',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(609,'TB0343802',6,1,2,'2026-01-08 02:03:46',-68,3,'95%','0.96',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(610,'TB0350778',11,1,1,'2026-01-08 02:51:35',-65,4,'48%','0.68',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(611,'TB0351515',2,3,1,'2026-01-08 02:29:31',-40,4,'50%','0.99',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(612,'TB0352398',2,3,1,'2026-01-08 02:49:17',-68,2,'98%','0.93',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(613,'TB0353262',3,1,1,'2026-01-08 02:54:26',-57,3,'89%','0.63',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(614,'TB0354862',5,1,2,'2026-01-08 02:24:40',-44,4,'59%','0.94',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(615,'TB0355830',4,3,1,'2026-01-08 02:33:45',-78,3,'96%','0.82',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(616,'TB0360284',1,1,2,'2026-01-08 02:27:26',-32,1,'70%','0.76',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(617,'TB0361668',9,2,1,'2026-01-08 02:05:18',-39,3,'43%','0.67',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(618,'TB0362313',12,1,2,'2026-01-08 02:29:55',-64,3,'40%','0.83',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(619,'TB0363761',9,3,1,'2026-01-08 02:55:31',-61,4,'64%','0.99',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(620,'TB0370863',9,1,1,'2026-01-08 02:10:16',-56,3,'48%','0.69',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(621,'TB0371185',2,2,1,'2026-01-08 02:57:56',-38,2,'61%','0.93',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(622,'TB0410305',11,1,2,'2026-01-08 03:38:43',-41,1,'93%','0.85',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(623,'TB0411572',9,2,2,'2026-01-08 03:58:31',-49,2,'89%','0.84',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(624,'TB0412153',5,1,1,'2026-01-08 03:30:20',-39,1,'45%','0.86',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(625,'TB0413378',9,1,2,'2026-01-08 03:58:26',-55,2,'67%','0.73',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(626,'TB0420946',10,2,1,'2026-01-08 03:39:32',-40,3,'52%','0.70',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(627,'TB0421307',1,2,2,'2026-01-08 03:29:56',-38,2,'94%','0.79',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(628,'TB0430988',6,1,2,'2026-01-08 03:56:36',-38,1,'50%','0.96',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(629,'TB0431391',3,1,2,'2026-01-08 03:28:49',-49,4,'99%','0.72',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(630,'TB0432801',7,2,1,'2026-01-08 03:17:52',-54,2,'58%','0.74',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(631,'TB0433977',4,1,2,'2026-01-08 03:58:22',-44,4,'58%','0.72',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(632,'TB0434124',11,2,1,'2026-01-08 03:26:27',-60,1,'41%','0.97',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(633,'TB0440353',8,2,2,'2026-01-08 03:29:04',-43,4,'71%','0.90',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(634,'TB0441264',1,1,1,'2026-01-08 03:42:04',-57,4,'89%','0.89',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(635,'TB0450578',5,3,2,'2026-01-08 03:25:16',-64,4,'100%','0.66',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(636,'TB0451541',7,2,2,'2026-01-08 03:22:19',-74,1,'91%','0.78',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(637,'TB0452110',3,2,2,'2026-01-08 03:32:52',-46,1,'66%','0.88',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(638,'TB0453630',4,1,2,'2026-01-08 03:42:10',-45,3,'82%','0.97',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(639,'TB0454626',4,2,2,'2026-01-08 03:37:49',-60,3,'65%','0.70',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(640,'TB0460149',7,2,2,'2026-01-08 03:44:34',-63,4,'82%','0.74',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(641,'TB0470170',7,1,1,'2026-01-08 03:57:20',-59,2,'52%','0.76',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(642,'TB0471704',10,2,1,'2026-01-08 03:33:27',-31,2,'87%','0.85',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(643,'TB0472119',9,3,1,'2026-01-08 03:31:51',-55,1,'63%','0.88',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(644,'TB0473126',4,3,2,'2026-01-08 03:52:10',-79,4,'71%','0.87',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(645,'TB0474138',8,3,2,'2026-01-08 03:46:40',-37,4,'86%','0.64',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(646,'TB0510102',7,1,2,'2026-01-08 04:42:15',-57,4,'97%','0.97',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(647,'TB0511397',1,1,2,'2026-01-08 04:48:26',-79,3,'54%','0.74',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(648,'TB0520129',2,1,2,'2026-01-08 04:14:52',-54,1,'91%','0.84',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(649,'TB0530394',5,3,1,'2026-01-08 04:50:10',-75,2,'92%','0.64',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(650,'TB0531971',8,1,1,'2026-01-08 04:10:05',-54,4,'64%','0.81',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(651,'TB0532144',7,3,1,'2026-01-08 04:02:52',-45,3,'90%','0.99',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(652,'TB0533265',4,3,2,'2026-01-08 04:14:40',-55,1,'71%','0.93',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(653,'TB0534315',7,1,2,'2026-01-08 04:34:47',-30,2,'48%','0.83',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(654,'TB0535738',5,2,1,'2026-01-08 04:06:41',-38,1,'71%','0.93',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(655,'TB0536261',5,2,2,'2026-01-08 04:52:04',-55,2,'87%','0.67',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(656,'TB0540755',8,1,1,'2026-01-08 04:50:36',-70,2,'69%','0.75',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(657,'TB0550258',10,1,2,'2026-01-08 04:30:40',-65,4,'55%','0.79',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(658,'TB0551580',7,3,2,'2026-01-08 04:34:19',-38,2,'87%','0.95',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(659,'TB0552463',10,1,1,'2026-01-08 04:48:50',-56,4,'86%','0.77',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(660,'TB0553640',4,1,2,'2026-01-08 04:14:37',-45,4,'77%','0.84',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(661,'TB0554349',3,2,2,'2026-01-08 04:51:51',-53,4,'88%','0.71',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(662,'TB0560630',7,1,1,'2026-01-08 04:19:01',-64,3,'73%','0.75',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(663,'TB0561376',12,2,2,'2026-01-08 04:08:31',-38,2,'98%','0.84',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(664,'TB0562257',3,2,1,'2026-01-08 04:49:32',-32,2,'97%','0.99',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(665,'TB0570461',6,3,2,'2026-01-08 04:31:01',-34,4,'59%','0.92',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(666,'TB0610745',10,1,1,'2026-01-08 05:45:11',-31,3,'69%','0.71',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(667,'TB0611462',7,1,1,'2026-01-08 05:26:46',-71,1,'97%','0.77',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(668,'TB0612288',8,3,1,'2026-01-08 05:40:05',-56,3,'73%','0.71',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(669,'TB0613815',1,2,2,'2026-01-08 05:29:18',-76,3,'42%','0.68',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(670,'TB0620935',6,1,1,'2026-01-08 05:53:31',-69,3,'83%','0.60',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(671,'TB0621429',4,1,2,'2026-01-08 05:10:43',-76,3,'53%','0.93',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(672,'TB0622472',4,3,2,'2026-01-08 05:02:53',-33,4,'64%','0.99',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(673,'TB0623815',9,2,2,'2026-01-08 05:58:52',-65,1,'79%','0.60',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(674,'TB0624373',2,1,2,'2026-01-08 05:15:26',-44,1,'98%','0.69',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(675,'TB0625157',12,3,1,'2026-01-08 05:13:17',-58,3,'41%','0.77',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(676,'TB0630350',4,2,1,'2026-01-08 05:00:20',-80,3,'85%','0.89',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(677,'TB0631504',1,1,2,'2026-01-08 05:54:26',-66,2,'85%','0.98',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(678,'TB0632719',12,1,2,'2026-01-08 05:51:37',-50,2,'88%','0.99',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(679,'TB0640809',2,3,2,'2026-01-08 05:34:00',-53,3,'71%','0.98',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(680,'TB0650967',2,3,1,'2026-01-08 05:09:22',-45,4,'71%','0.72',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(681,'TB0651115',3,2,1,'2026-01-08 05:47:44',-37,3,'62%','0.87',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(682,'TB0652349',10,3,1,'2026-01-08 05:45:00',-44,2,'56%','0.62',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(683,'TB0653748',2,1,2,'2026-01-08 05:05:40',-43,1,'48%','0.88',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(684,'TB0660941',10,3,1,'2026-01-08 05:51:18',-57,3,'81%','0.78',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(685,'TB0661230',9,2,1,'2026-01-08 05:25:31',-61,1,'70%','0.73',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(686,'TB0670493',7,1,2,'2026-01-08 05:05:27',-78,4,'77%','0.70',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(687,'TB0710823',4,3,1,'2026-01-08 06:54:50',-53,2,'50%','0.84',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(688,'TB0711185',11,2,1,'2026-01-08 06:13:55',-53,1,'83%','0.89',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(689,'TB0712230',1,3,2,'2026-01-08 06:47:19',-52,2,'40%','0.68',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(690,'TB0713787',1,1,1,'2026-01-08 06:57:34',-30,2,'92%','0.99',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(691,'TB0714165',1,1,2,'2026-01-08 06:15:47',-77,2,'47%','0.61',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(692,'TB0720230',12,1,1,'2026-01-08 06:14:29',-46,4,'76%','0.62',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(693,'TB0721275',11,2,2,'2026-01-08 06:50:14',-50,1,'59%','0.91',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(694,'TB0730332',12,2,1,'2026-01-08 06:51:56',-36,4,'40%','0.88',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(695,'TB0740930',5,1,2,'2026-01-08 06:47:24',-33,2,'71%','0.80',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(696,'TB0741976',8,3,2,'2026-01-08 06:33:27',-44,1,'81%','0.80',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(697,'TB0742135',7,1,1,'2026-01-08 06:29:27',-59,1,'64%','0.69',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(698,'TB0743150',10,3,1,'2026-01-08 06:39:08',-58,4,'70%','0.86',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(699,'TB0744204',9,1,1,'2026-01-08 06:25:37',-51,1,'47%','0.93',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(700,'TB0750787',7,1,2,'2026-01-08 06:16:25',-69,1,'100%','0.85',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(701,'TB0751258',9,3,2,'2026-01-08 06:58:16',-45,4,'51%','0.71',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(702,'TB0752924',4,1,1,'2026-01-08 06:11:35',-63,4,'97%','0.79',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(703,'TB0753784',1,1,2,'2026-01-08 06:21:10',-64,2,'46%','0.73',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(704,'TB0754391',8,2,2,'2026-01-08 06:53:24',-75,3,'82%','0.80',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(705,'TB0755392',12,3,1,'2026-01-08 06:24:44',-69,2,'63%','0.65',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(706,'TB0760372',1,1,1,'2026-01-08 06:18:01',-42,3,'76%','0.63',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(707,'TB0761144',9,1,1,'2026-01-08 06:57:30',-74,1,'41%','0.95',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(708,'TB0762737',4,2,1,'2026-01-08 06:11:36',-78,1,'70%','0.75',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(709,'TB0763166',2,1,1,'2026-01-08 06:22:25',-77,3,'100%','0.90',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(710,'TB0764294',7,1,1,'2026-01-08 06:49:35',-69,2,'94%','0.75',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(711,'TB0765606',9,2,1,'2026-01-08 06:34:24',-39,1,'98%','0.97',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(712,'TB0770151',10,1,2,'2026-01-08 06:29:31',-34,4,'89%','0.79',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(713,'TB0771903',1,1,2,'2026-01-08 06:34:21',-44,2,'54%','0.69',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(714,'TB0772141',5,1,1,'2026-01-08 06:49:07',-77,2,'54%','0.84',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(715,'TB0810854',11,1,2,'2026-01-08 07:02:29',-57,3,'81%','0.65',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(716,'TB0820404',6,2,1,'2026-01-08 07:13:25',-66,2,'87%','0.87',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(717,'TB0821372',9,1,1,'2026-01-08 07:33:33',-45,4,'59%','0.92',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(718,'TB0822523',10,1,1,'2026-01-08 07:44:37',-69,4,'83%','0.66',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(719,'TB0830782',1,3,1,'2026-01-08 07:44:06',-80,4,'52%','0.87',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(720,'TB0831748',3,3,2,'2026-01-08 07:53:29',-30,2,'94%','0.61',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(721,'TB0832992',3,1,1,'2026-01-08 07:30:40',-78,2,'46%','0.81',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(722,'TB0833649',12,1,2,'2026-01-08 07:06:17',-69,2,'47%','0.94',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(723,'TB0834214',8,1,2,'2026-01-08 07:01:18',-35,1,'95%','0.65',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(724,'TB0840678',4,2,1,'2026-01-08 07:35:37',-77,1,'86%','0.98',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(725,'TB0841867',8,2,1,'2026-01-08 07:45:45',-49,3,'67%','0.99',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(726,'TB0842986',11,2,1,'2026-01-08 07:39:38',-32,2,'47%','0.93',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(727,'TB0843857',12,3,2,'2026-01-08 07:52:24',-49,3,'46%','0.81',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(728,'TB0844528',9,3,2,'2026-01-08 07:18:35',-59,3,'70%','0.92',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(729,'TB0845979',9,2,1,'2026-01-08 07:43:10',-34,2,'99%','0.91',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(730,'TB0850259',3,3,2,'2026-01-08 07:06:25',-35,3,'52%','0.86',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(731,'TB0851652',11,2,1,'2026-01-08 07:22:00',-58,2,'65%','0.77',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(732,'TB0852292',1,1,2,'2026-01-08 07:34:02',-42,1,'55%','0.97',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(733,'TB0860756',10,2,1,'2026-01-08 07:23:35',-35,3,'67%','0.86',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(734,'TB0870138',11,2,2,'2026-01-08 07:12:09',-30,3,'50%','0.90',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(735,'TB0871876',4,2,2,'2026-01-08 07:12:53',-47,2,'70%','0.97',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(736,'TB0872545',5,2,2,'2026-01-08 07:08:13',-54,4,'73%','0.76',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(737,'TB0873222',10,3,2,'2026-01-08 07:14:37',-74,1,'57%','0.96',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(738,'TB0874757',3,3,1,'2026-01-08 07:40:07',-30,3,'100%','0.94',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(739,'TB0875699',2,1,1,'2026-01-08 07:43:07',-63,1,'75%','0.92',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(740,'TB0910552',6,2,1,'2026-01-08 08:32:37',-39,3,'58%','0.80',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(741,'TB0911131',6,2,2,'2026-01-08 08:43:51',-56,1,'84%','0.94',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(742,'TB0912923',4,2,2,'2026-01-08 08:41:13',-62,3,'56%','0.77',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(743,'TB0920375',10,3,2,'2026-01-08 08:47:05',-62,2,'99%','0.65',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(744,'TB0921562',11,3,1,'2026-01-08 08:13:20',-56,2,'47%','0.80',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(745,'TB0922842',9,1,1,'2026-01-08 08:04:42',-73,1,'95%','0.82',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(746,'TB0923317',4,1,1,'2026-01-08 08:05:21',-71,4,'65%','0.67',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(747,'TB0924239',10,1,1,'2026-01-08 08:49:26',-31,3,'60%','0.66',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(748,'TB0930329',11,3,2,'2026-01-08 08:05:31',-48,4,'96%','0.60',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(749,'TB0940305',11,1,2,'2026-01-08 08:55:37',-59,2,'59%','0.96',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(750,'TB0941250',10,3,2,'2026-01-08 08:29:12',-74,2,'83%','0.75',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(751,'TB0942377',6,2,1,'2026-01-08 08:18:48',-50,2,'74%','0.98',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(752,'TB0943329',4,2,2,'2026-01-08 08:48:14',-59,3,'49%','0.67',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(753,'TB0944919',2,1,2,'2026-01-08 08:50:00',-39,3,'41%','0.98',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(754,'TB0950191',7,1,1,'2026-01-08 08:02:00',-33,4,'71%','0.97',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(755,'TB0951817',8,3,2,'2026-01-08 08:21:47',-60,4,'87%','0.95',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(756,'TB0952355',2,1,1,'2026-01-08 08:50:21',-54,2,'41%','0.99',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(757,'TB0953857',6,2,1,'2026-01-08 08:41:48',-50,4,'100%','0.65',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(758,'TB0954356',8,1,2,'2026-01-08 08:40:26',-54,3,'57%','0.75',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(759,'TB0955238',9,3,2,'2026-01-08 08:56:37',-61,1,'79%','0.83',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(760,'TB0960252',5,2,2,'2026-01-08 08:30:09',-49,3,'63%','0.85',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(761,'TB0961265',11,1,2,'2026-01-08 08:25:18',-70,1,'65%','0.70',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(762,'TB0962941',9,1,1,'2026-01-08 08:17:48',-53,1,'50%','0.99',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(763,'TB0963317',6,3,2,'2026-01-08 08:48:29',-56,4,'57%','0.91',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(764,'TB0970925',10,3,1,'2026-01-08 08:23:02',-55,1,'64%','0.65',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(765,'TB0971936',7,1,1,'2026-01-08 08:14:45',-59,4,'67%','0.89',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(766,'TB0972714',9,2,2,'2026-01-08 08:42:16',-52,3,'54%','0.84',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(767,'TB0973207',2,1,2,'2026-01-08 08:22:34',-80,4,'100%','0.70',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(768,'TB1010402',3,1,1,'2026-01-08 09:33:07',-51,1,'87%','0.73',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(769,'TB1011896',11,3,1,'2026-01-08 09:00:25',-34,4,'68%','0.64',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(770,'TB1012638',2,3,1,'2026-01-08 09:34:05',-34,1,'61%','0.93',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(771,'TB1013467',2,3,1,'2026-01-08 09:56:35',-58,1,'78%','0.92',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(772,'TB1020706',4,2,1,'2026-01-08 09:32:39',-58,3,'92%','0.71',3,2,'seed-12h-rand','2026-01-08 10:03:01'),(773,'TB1021294',11,1,1,'2026-01-08 09:14:46',-41,3,'53%','0.99',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(774,'TB1030554',3,2,1,'2026-01-08 09:38:24',-66,3,'93%','0.61',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(775,'TB1031404',1,1,1,'2026-01-08 09:54:29',-40,1,'61%','0.63',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(776,'TB1032877',6,1,2,'2026-01-08 09:43:46',-78,1,'65%','0.74',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(777,'TB1033449',5,2,2,'2026-01-08 09:29:33',-51,3,'61%','0.73',3,3,'seed-12h-rand','2026-01-08 10:03:01'),(778,'TB1034362',10,2,1,'2026-01-08 09:38:08',-65,2,'71%','0.76',1,3,'seed-12h-rand','2026-01-08 10:03:01'),(779,'TB1040691',11,1,1,'2026-01-08 09:54:47',-50,3,'56%','0.73',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(780,'TB1050433',5,3,2,'2026-01-08 09:11:49',-52,4,'75%','0.91',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(781,'TB1051409',6,2,2,'2026-01-08 09:46:04',-78,2,'56%','0.88',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(782,'TB1052931',2,1,1,'2026-01-08 09:40:14',-50,1,'57%','0.98',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(783,'TB1053581',5,3,1,'2026-01-08 09:38:58',-34,2,'52%','0.93',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(784,'TB1060976',6,1,1,'2026-01-08 09:28:31',-65,4,'75%','0.82',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(785,'TB1061282',9,1,1,'2026-01-08 09:16:38',-68,4,'84%','0.64',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(786,'TB1062104',10,1,2,'2026-01-08 09:17:00',-54,3,'56%','0.68',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(787,'TB1070829',4,3,2,'2026-01-08 09:13:24',-42,2,'50%','0.64',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(788,'TB1071729',3,3,1,'2026-01-08 09:45:50',-52,3,'88%','0.61',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(789,'TB1072673',5,1,2,'2026-01-08 09:24:05',-51,3,'83%','0.61',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(790,'TB1073929',3,1,2,'2026-01-08 09:54:59',-46,3,'67%','0.78',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(791,'TB1074413',12,2,1,'2026-01-08 09:35:56',-54,1,'86%','0.96',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(792,'TB1075890',6,1,2,'2026-01-08 09:55:46',-55,2,'45%','0.70',1,7,'seed-12h-rand','2026-01-08 10:03:01'),(793,'TB1076989',6,3,1,'2026-01-08 09:44:04',-54,4,'76%','0.88',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(794,'TB1110613',4,3,1,'2026-01-08 10:07:41',-45,4,'81%','0.91',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(795,'TB1111130',4,2,1,'2026-01-08 10:15:49',-46,1,'59%','0.72',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(796,'TB1112320',12,3,1,'2026-01-08 10:25:55',-59,3,'77%','0.68',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(797,'TB1113709',5,2,1,'2026-01-08 10:32:28',-58,2,'67%','0.88',3,1,'seed-12h-rand','2026-01-08 10:03:01'),(798,'TB1114405',4,3,1,'2026-01-08 10:05:15',-75,3,'79%','0.69',1,1,'seed-12h-rand','2026-01-08 10:03:01'),(799,'TB1115888',10,1,2,'2026-01-08 10:26:03',-76,4,'76%','0.69',2,1,'seed-12h-rand','2026-01-08 10:03:01'),(800,'TB1120897',3,1,2,'2026-01-08 10:22:59',-55,1,'99%','0.96',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(801,'TB1121199',10,1,2,'2026-01-08 10:47:04',-70,4,'61%','0.98',1,2,'seed-12h-rand','2026-01-08 10:03:01'),(802,'TB1122899',5,1,2,'2026-01-08 10:46:03',-43,3,'65%','0.64',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(803,'TB1123953',9,3,2,'2026-01-08 10:52:54',-38,1,'75%','0.93',2,2,'seed-12h-rand','2026-01-08 10:03:01'),(804,'TB1130663',11,3,1,'2026-01-08 10:39:18',-34,1,'54%','0.66',2,3,'seed-12h-rand','2026-01-08 10:03:01'),(805,'TB1140274',10,1,2,'2026-01-08 10:39:48',-63,3,'84%','0.98',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(806,'TB1141710',3,2,2,'2026-01-08 10:38:23',-72,1,'47%','0.68',2,4,'seed-12h-rand','2026-01-08 10:03:01'),(807,'TB1142295',8,3,1,'2026-01-08 10:25:39',-45,3,'90%','0.60',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(808,'TB1143933',8,1,1,'2026-01-08 10:05:29',-36,2,'61%','0.99',1,4,'seed-12h-rand','2026-01-08 10:03:01'),(809,'TB1144699',2,3,2,'2026-01-08 10:47:40',-45,3,'78%','0.72',3,4,'seed-12h-rand','2026-01-08 10:03:01'),(810,'TB1150760',11,1,2,'2026-01-08 10:12:24',-50,1,'50%','0.78',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(811,'TB1151697',10,3,2,'2026-01-08 10:48:57',-38,1,'65%','0.63',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(812,'TB1152750',4,2,1,'2026-01-08 10:27:56',-57,2,'68%','0.84',3,5,'seed-12h-rand','2026-01-08 10:03:01'),(813,'TB1153585',4,1,1,'2026-01-08 10:53:18',-62,1,'63%','0.79',1,5,'seed-12h-rand','2026-01-08 10:03:01'),(814,'TB1154975',6,1,2,'2026-01-08 10:54:15',-52,3,'77%','0.90',2,5,'seed-12h-rand','2026-01-08 10:03:01'),(815,'TB1160124',5,1,1,'2026-01-08 10:50:18',-43,2,'76%','0.66',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(816,'TB1161486',9,2,2,'2026-01-08 10:07:12',-35,3,'57%','0.70',3,6,'seed-12h-rand','2026-01-08 10:03:01'),(817,'TB1162964',3,1,1,'2026-01-08 10:58:01',-46,1,'94%','0.98',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(818,'TB1163202',4,3,2,'2026-01-08 10:52:08',-78,3,'60%','0.89',1,6,'seed-12h-rand','2026-01-08 10:03:01'),(819,'TB1164975',11,1,2,'2026-01-08 10:38:36',-73,3,'58%','0.60',2,6,'seed-12h-rand','2026-01-08 10:03:01'),(820,'TB1170285',9,1,2,'2026-01-08 10:03:29',-66,1,'92%','0.68',2,7,'seed-12h-rand','2026-01-08 10:03:01'),(821,'TB1171261',12,1,1,'2026-01-08 10:24:05',-57,4,'94%','0.86',3,7,'seed-12h-rand','2026-01-08 10:03:01'),(822,'TB1172178',6,3,1,'2026-01-08 10:04:59',-80,3,'84%','0.86',3,7,'seed-12h-rand','2026-01-08 10:03:01');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='车辆监控';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitors`
--

LOCK TABLES `monitors` WRITE;
/*!40000 ALTER TABLE `monitors` DISABLE KEYS */;
INSERT INTO `monitors` VALUES (1,2,'2025-06-05 08:46:30',2);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='标签表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rfid_tags`
--

LOCK TABLES `rfid_tags` WRITE;
/*!40000 ALTER TABLE `rfid_tags` DISABLE KEYS */;
INSERT INTO `rfid_tags` VALUES (1,'xoxoxoxo',NULL,1,'发发发hh','2025-08-05 19:44:05','哈哈哈哈'),(3,'hshshshshs',NULL,1,'放到v分','2025-02-24 04:34:43','22');
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
  `role_id` varchar(36) DEFAULT NULL,
  `page_id` varchar(36) DEFAULT NULL,
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
INSERT INTO `stores` VALUES (1,'01号库',1),(2,'12号库',1),(3,'14号库',1),(4,'12库',4),(5,'14库',4),(14,'16库',4);
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

-- Dump completed on 2026-01-15 17:46:40
