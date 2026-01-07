
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

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cms`;
DROP TABLE IF EXISTS `alarm_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `rule_name` varchar(100) DEFAULT NULL COMMENT '规则名',
  `rule_key` varchar(100) DEFAULT NULL COMMENT '唯一键',
  `rule_value` varchar(100) DEFAULT NULL COMMENT '规则',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='告警通知设置';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `alarm_rules` WRITE;
/*!40000 ALTER TABLE `alarm_rules` DISABLE KEYS */;
INSERT INTO `alarm_rules` VALUES (1,'规则1','哈哈怼','的水滴石穿吃的');
/*!40000 ALTER TABLE `alarm_rules` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `args`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `args` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arg_key` varchar(100) DEFAULT NULL COMMENT '参数键，如 idle_timeout',
  `arg_name` varchar(100) DEFAULT NULL COMMENT '参数中文名，如 呆滞时间',
  `arg_value` varchar(100) DEFAULT NULL COMMENT '参数值（统一存字符串）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='业务参数表';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `args` WRITE;
/*!40000 ALTER TABLE `args` DISABLE KEYS */;
INSERT INTO `args` VALUES (1,'key1','key1','value1'),(2,'c',' 吃',' 吃s'),(3,'offlineTime','离线时间','24');
/*!40000 ALTER TABLE `args` ENABLE KEYS */;
UNLOCK TABLES;
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
  `tag_id` int DEFAULT NULL COMMENT '绑定的tagid',
  PRIMARY KEY (`asset_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (17,'那就不参加',1,2,'2025-06-09 17:37:00','2025-06-09 17:37:00',NULL,NULL,NULL),(18,'氛围灯',1,2,'2025-06-09 17:41:49','2025-06-09 17:41:49',NULL,NULL,NULL),(25,'大的',2,2,'2025-06-09 17:42:29','2025-06-09 17:42:29',NULL,NULL,NULL),(26,'12',1,2,'2025-06-09 17:46:29','2025-06-09 17:46:29',NULL,NULL,NULL),(27,'333',1,2,'2025-06-09 18:05:40','2025-06-09 18:24:16',NULL,33,3),(28,'34',1,3,'2025-06-09 18:26:46','2025-06-09 18:26:46',NULL,33,3);
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `asset_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_groups` (
  `asset_id` int NOT NULL,
  `group_id` int DEFAULT NULL,
  PRIMARY KEY (`asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产与班组的对应表';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `asset_groups` WRITE;
/*!40000 ALTER TABLE `asset_groups` DISABLE KEYS */;
INSERT INTO `asset_groups` VALUES (6,2),(11,1),(12,1),(14,1),(15,1),(17,1),(18,2),(25,3),(26,4),(27,1),(28,2);
/*!40000 ALTER TABLE `asset_groups` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `asset_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asset_types` (
  `type_id` int NOT NULL,
  `type_name` varchar(255) DEFAULT NULL COMMENT '资产类型名称',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产和资产类型表';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `asset_types` WRITE;
/*!40000 ALTER TABLE `asset_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_types` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `buzzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buzzers` (
  `buzzer_id` int NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `buzzer_rule` varchar(100) DEFAULT NULL COMMENT '蜂鸣器报警规则',
  PRIMARY KEY (`buzzer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='蜂鸣器报警规则表';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `buzzers` WRITE;
/*!40000 ALTER TABLE `buzzers` DISABLE KEYS */;
INSERT INTO `buzzers` VALUES (2,'呜呜呜  谢谢'),(3,' 传惨'),(4,'垃圾'),(6,'线下'),(7,'哈哈哈尺寸');
/*!40000 ALTER TABLE `buzzers` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES ('47230539865788416','旭升科技有限责任公司',NULL,'2024-05-10 15:57:18','2024-05-10 21:29:05',NULL,0,'旭升科技有限责任公司'),('47230730614345728','旭升科技有限责任公司（成都分公司）',NULL,'2024-05-10 15:58:03','2024-05-10 21:28:57',NULL,1,'旭升科技有限责任公司（成都分公司）'),('47230853654253568','软件开发部','47230539865788416','2024-05-10 15:58:33','2024-05-10 15:58:33',NULL,0,'软件开发部'),('47230946730053632','前端部门','47230853654253568','2024-05-10 15:58:55','2024-05-10 17:10:40',NULL,0,'负责软件界面开发'),('47231640862199808','市场营销部','47230539865788416','2024-05-10 16:01:40','2024-05-10 16:01:40',NULL,1,'市场营销'),('47231703478964224','人事部','47230539865788416','2024-05-10 16:01:55','2024-05-10 16:02:00',NULL,2,'人事部'),('47231806839197696','采购部','47230539865788416','2024-05-10 16:02:20','2024-05-10 16:02:20',NULL,3,'采购'),('47231951035174912','国际贸易部','47230730614345728','2024-05-10 16:02:54','2024-05-10 16:02:54',NULL,0,'国际贸易部'),('47248253208498176','Java开发部','47230853654253568','2024-05-10 17:07:41','2024-05-10 17:07:41',NULL,1,'Java开发部');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT COMMENT '资产部门ID',
  `department_name` varchar(100) DEFAULT NULL COMMENT '资产部门名称',
  `store_id` int DEFAULT NULL COMMENT '一一对应场库',
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='资产部门';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'e2',2),(3,'22',2);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `exception_records` WRITE;
/*!40000 ALTER TABLE `exception_records` DISABLE KEYS */;
INSERT INTO `exception_records` VALUES (1,0,0,'2025-08-07 13:08:39',0,'','','2025-08-07 13:08:39','2025-08-07 13:08:39');
/*!40000 ALTER TABLE `exception_records` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `gardens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gardens` (
  `garden_id` int NOT NULL AUTO_INCREMENT COMMENT '园区id',
  `garden_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`garden_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='园区信息';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `gardens` WRITE;
/*!40000 ALTER TABLE `gardens` DISABLE KEYS */;
INSERT INTO `gardens` VALUES (4,'一号园区'),(6,'二号园区'),(7,'三号园区');
/*!40000 ALTER TABLE `gardens` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `gateways` WRITE;
/*!40000 ALTER TABLE `gateways` DISABLE KEYS */;
INSERT INTO `gateways` VALUES (1,'网关1','111',1,NULL,NULL,1);
/*!40000 ALTER TABLE `gateways` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `group_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_stores` (
  `group_id` int DEFAULT NULL COMMENT '班组ID',
  `store_id` int DEFAULT NULL COMMENT '场库ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班组与场库对应关系';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `group_stores` WRITE;
/*!40000 ALTER TABLE `group_stores` DISABLE KEYS */;
INSERT INTO `group_stores` VALUES (2,4),(3,5),(4,10),(1,4),(1,4),(2,4),(3,5),(2,4),(1,4);
/*!40000 ALTER TABLE `group_stores` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班组';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'上海组'),(2,'湖北组'),(3,'湖南组'),(4,'西班牙组');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `interfaces` WRITE;
/*!40000 ALTER TABLE `interfaces` DISABLE KEYS */;
INSERT INTO `interfaces` VALUES ('37899586299236352','获取菜单','GET','/pages','40708567220621312','GET:/pages','获取菜单',0,'2024-04-14 21:59:25','2024-05-11 16:04:13'),('37899744348999680','获取用户菜单','GET','/pages/menus','40708567220621312','GET:/pages/menus','获取用户菜单',0,'2024-04-14 22:00:03','2024-05-11 16:04:13'),('40696216958275584','新建菜单','POST','/pages','40708567220621312','POST:/pages','新建菜单',0,'2024-04-22 15:12:14','2024-05-11 16:04:13'),('41065294818447360','创建用户','POST','/users','40351711566499840','POST:/users','创建用户',0,'2024-04-23 15:38:49','2024-05-11 16:04:13'),('41789444067430400','获取用户','POST','/users/query','40351711566499840','POST:/users/query','获取用户',0,'2024-04-25 17:20:52','2024-05-11 16:04:13'),('41903454221766656','获取角色','POST','/roles/query','40352343601975296','POST:/roles/query','获取角色',0,'2024-04-25 23:09:21','2024-05-11 16:04:13'),('41906647861301248','获取部门','GET','/department','40352749044371456','GET:/department','获取部门',0,'2024-04-25 23:22:03','2024-05-11 16:04:13'),('42063400649363456','更新用户','PATCH','/users/:id','40351711566499840','PATCH:/users/:id','更新用户',0,'2024-04-26 09:44:56','2024-05-11 16:04:13'),('42071947340681216','删除用户','DELETE','/users/:id','40351711566499840','DELETE:/users/:id','删除用户',0,'2024-04-26 10:18:53','2024-05-11 16:04:13'),('42079060825739264','获取用户详情','GET','/users/:id','40351711566499840','GET:/users/:id','获取用户详情',0,'2024-04-26 10:47:09','2024-05-11 17:24:40'),('44326032676753408','删除角色','DELETE','/roles/:id','40352343601975296','DELETE:/roles/:id','获取Git提交次数',0,'2024-05-02 15:35:49','2024-05-11 16:04:13'),('44332995393359872','导出角色','POST','/roles/export','40352343601975296','POST:/roles/export','导出角色',0,'2024-05-02 16:03:29','2024-05-11 16:04:13'),('44333062707744768','导出用户','POST','/users/export','40351711566499840','POST:/users/export','导出用户',0,'2024-05-02 16:03:45','2024-05-11 16:04:13'),('44474438040686592','更新角色','PATCH','/roles/:id','40352343601975296','PATCH:/roles/:id','更新角色',0,'2024-05-03 01:25:32','2024-05-11 16:04:13'),('45864670036234240','新增角色','POST','/roles','40352343601975296','POST:/roles','新增角色',0,'2024-05-06 21:29:49','2024-05-11 16:04:13'),('46239031234662400','通过角色ID查询用户','GET','/users/role/:id','40352343601975296','GET:/users/role/:id','通过角色ID查询用户',0,'2024-05-07 22:17:24','2024-05-11 16:04:13'),('46858901232029696','绑定用户','POST','/roles/bindUser','40352343601975296','POST:/roles/bindUser','绑定用户',0,'2024-05-09 15:20:32','2024-05-11 16:04:13'),('46859015694585856','解绑用户','POST','/roles/deBindUser','40352343601975296','POST:/roles/deBindUser','解绑用户',0,'2024-05-09 15:20:59','2024-05-11 16:04:13'),('46859424727306240','查询角色之外的用户','POST','/users/query/role/:id','40352343601975296','POST:/users/query/role/:id','查询角色之外的用户',0,'2024-05-09 15:22:37','2024-05-11 16:04:13'),('46862379094380544','创建菜单','POST','/pages','40708567220621312','POST:/pages','创建菜单',0,'2024-05-09 15:34:21','2024-05-11 16:04:13'),('46862511944765440','删除菜单','DELETE','/pages/:id','40708567220621312','DELETE:/pages/:id','创建菜单',0,'2024-05-09 15:34:53','2024-05-11 16:04:13'),('46862830229524480','获取菜单（All）','GET','/pages','40708567220621312','GET:/pages','获取菜单（All）',0,'2024-05-09 15:36:09','2024-05-11 16:04:13'),('46863099453509632','获取菜单（User）','GET','/pages/user','40708567220621312','GET:/pages/user','获取菜单（User）',0,'2024-05-09 15:37:13','2024-05-11 16:04:13'),('46863346367991808','更新菜单','PATCH','/pages/:id','40708567220621312','PATCH:/pages/:id','PATCH',0,'2024-05-09 15:38:12','2024-05-11 16:04:13'),('46863589419520000','获取菜单（Role）','GET','/pages/role/:id','40708567220621312','GET:/pages/role/:id','GET',0,'2024-05-09 15:39:10','2024-05-11 16:04:13'),('47156442767036416','创建部门','POST','/department','40352749044371456','POST:/department','创建部门',0,'2024-05-10 11:02:52','2024-05-11 16:04:13'),('47216551878725632','删除部门','DELETE','/department/:id','40352749044371456','DELETE:/department/:id','删除部门',0,'2024-05-10 15:01:43','2024-05-11 16:04:13'),('47216745617821696','更新部门','PATCH','/department/:id','40352749044371456','PATCH:/department/:id','更新部门',0,'2024-05-10 15:02:29','2024-05-11 16:04:13'),('47584267768696832','获取接口（Page）','GET','/interface/page/:id','40708567220621312','GET:/interface/page/:id','获取接口（Page）',0,'2024-05-11 15:22:53','2024-05-11 16:04:13'),('47593342061514752','删除接口','DELETE','/interface/:id','40708567220621312','DELETE:/interface/:id','删除接口',0,'2024-05-11 15:58:57','2024-05-11 16:04:13'),('47608622313639936','新增接口','POST','/interface','40708567220621312','POST:/interface','新增接口',0,'2024-05-11 16:59:40','2024-05-11 17:00:53'),('47608882222075904','更新接口','PATCH','/interface/:id','40708567220621312','PATCH:/interface/:id','更新接口',0,'2024-05-11 17:00:42','2024-05-11 17:06:39'),('47973984368594944','获取文件','GET','/upload','47973248603787264','GET:/upload','获取文件列表',0,'2024-05-12 17:11:29','2024-05-12 17:21:04'),('47974191147782144','删除文件','DELETE','/upload/del/:id','47973248603787264','DELETE:/upload/del/:id','删除文件',0,'2024-05-12 17:12:18','2024-05-12 17:21:04'),('47974424665657344','查看文件状态','POST','/upload/check','47973248603787264','POST:/upload/check','上传文件是需要检查文件是否上传以及上传了多少',0,'2024-05-12 17:13:14','2024-05-12 17:21:04'),('47974555385335808','上传文件','POST','/upload','47973248603787264','POST:/upload','上传文件',0,'2024-05-12 17:13:45','2024-05-12 17:21:04'),('47974732070391808','完成上传','POST','/upload/finish','47973248603787264','POST:/upload/finish','告诉服务器文件已全部上传完毕',0,'2024-05-12 17:14:27','2024-05-12 17:21:04'),('47974990527598592','文件下载（POST）','POST','/upload/download/:id','47973248603787264','POST:/upload/download/:id','通过Ajax下载文件',0,'2024-05-12 17:15:29','2024-05-12 17:21:04'),('47975191568977920','文件下载（GET）','GET','/upload/aHref/download/:id','47973248603787264','GET:/upload/aHref/download/:id','通过 a 标签下载文件',0,'2024-05-12 17:16:17','2024-05-12 17:21:04'),('47975597174951936','获取Cookie','GET','/auth/cookie','47973248603787264','GET:/auth/cookie','a标签下载文件需要先获取Cookie,该Ckooiie只能使用一次就会过期',0,'2024-05-12 17:17:53','2024-05-12 17:21:04'),('47976243613667328','获取系统日志','GET','/log/system','47975943540576256','GET:/log/system','获取系统日志',0,'2024-05-12 17:20:27','2024-05-12 17:21:04'),('49391522268844032','获取定时任务列表','GET','/timeTask','49387228375289856','GET:/timeTask','获取定时任务列表',1,'2024-05-16 15:04:16','2024-05-16 15:08:02'),('49391714045005824','开始定时任务','POST','/timeTask/start/:id','49387228375289856','POST:/timeTask/start/:id','开始定时任务',1,'2024-05-16 15:05:02','2024-05-16 15:05:02'),('49391851559456768','停止定时任务','POST','/timeTask/stop/:id','49387228375289856','POST:/timeTask/stop/:id','停止定时任务',1,'2024-05-16 15:05:35','2024-05-16 15:05:35'),('49392003502313472','更新定时任务','PATCH','/timeTask/update/:id','49387228375289856','PATCH:/timeTask/update/:id','更新定时任务',1,'2024-05-16 15:06:11','2024-05-16 15:06:11');
/*!40000 ALTER TABLE `interfaces` ENABLE KEYS */;
UNLOCK TABLES;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='出入库记录';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `io_records` WRITE;
/*!40000 ALTER TABLE `io_records` DISABLE KEYS */;
INSERT INTO `io_records` (`asset_id`,`action_type`,`action_time`,`store_from`,`store_to`,`tag_code`) VALUES (0,1,'2025-06-04 05:14:33',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:33',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:36',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:37',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(0,2,'2025-06-04 08:08:38',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:44',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:44',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(0,1,'2025-06-04 08:08:45',NULL,NULL,NULL),(0,1,'2025-06-04 09:37:05',NULL,NULL,NULL),(0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(0,1,'2025-06-04 09:37:06',NULL,NULL,NULL),(0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(0,2,'2025-06-04 09:37:11',NULL,NULL,NULL),(6,1,'2025-06-05 03:46:04',0,1,NULL),(1,1,'2025-07-03 13:31:02',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:04',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:04',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:05',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(1,1,'2025-07-03 13:31:06',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:10',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:11',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:12',NULL,NULL,NULL),(1,0,'2025-07-03 13:31:12',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:06',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:07',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:08',NULL,NULL,NULL),(1,2,'2025-07-03 13:38:09',NULL,NULL,NULL),(27,3,'2026-01-07 05:42:16',NULL,NULL,'呃呃呃呃'),(28,3,'2026-01-07 05:42:16',NULL,NULL,'呃呃呃呃');
/*!40000 ALTER TABLE `io_records` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lines` (
  `line_id` int NOT NULL AUTO_INCREMENT,
  `line_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`line_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='周转线路';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `lines` WRITE;
/*!40000 ALTER TABLE `lines` DISABLE KEYS */;
INSERT INTO `lines` VALUES (1,'线路123'),(2,'线路2');
/*!40000 ALTER TABLE `lines` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `monitors` WRITE;
/*!40000 ALTER TABLE `monitors` DISABLE KEYS */;
INSERT INTO `monitors` VALUES (1,2,'2025-06-05 08:46:30',2);
/*!40000 ALTER TABLE `monitors` ENABLE KEYS */;
UNLOCK TABLES;
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
  `inventory_status` int DEFAULT 1 COMMENT '盘点状态 (1:正常, 2:异常)',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_tag_code` (`tag_code`),
  KEY `idx_asset_id` (`asset_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_inventory_time` (`inventory_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='盘点记录表';
/*!40101 SET @saved_cs_client = @saved_cs_client */;
LOCK TABLES `inventory_records` WRITE;
/*!40000 ALTER TABLE `inventory_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory_records` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES ('1767758404441442','190037519541211136','盘点详情','/iot/inventory-detail','AccountBookFilled','InventoryDetail',3,1,0,NULL,'2025-06-08 10:30:00','2026-01-07 06:19:15',NULL),('186756320915886080',NULL,'资产台账','/asset','AccountBookFilled','Asset',11,1,0,NULL,'2025-05-30 08:22:56','2025-05-30 08:29:40',NULL),('187796493954977792',NULL,'资产管理','/inventory','AccountBookFilled','Inventory',12,1,0,NULL,'2025-06-02 05:16:13','2025-06-05 06:04:41',NULL),('187796622602670080',NULL,'出入库管理','/io-record','AccountBookFilled','xx',13,1,0,NULL,'2025-06-02 05:16:43','2025-06-04 05:07:38',NULL),('187796749966905344',NULL,'场库管理','/site','AccountBookFilled','xx',14,1,0,NULL,'2025-06-02 05:17:14','2025-06-04 05:08:08',NULL),('187807279746125824','187796749966905344','园区管理','/site/garden','AccountBookFilled','Garden',1,1,0,NULL,'2025-06-02 07:45:03','2025-06-04 05:25:33',NULL),('187807398822416384','187796749966905344','场库信息','/site/store','AccountBookFilled','Store',2,1,0,NULL,'2025-06-02 07:45:31','2025-06-04 05:25:41',NULL),('188518807294185472','187796622602670080','出入库台账','/io-record/ledger','AccountBookFilled','IoRecordLedger',1,1,0,NULL,'2025-06-04 05:06:26','2025-06-04 05:06:26',NULL),('188524722328178688','187796622602670080','出入库面板','/io-record/panel','AccountBookFilled','panel',2,1,0,NULL,'2025-06-04 05:29:56','2025-06-04 05:29:56',NULL),('188525142412890112','187796622602670080','蜂鸣器报警规则','/io-record/buzzer','AccountBookFilled','Buzzer',3,1,0,NULL,'2025-06-04 05:31:36','2025-06-04 05:31:36',NULL),('188611286865547264',NULL,'统计分析','/analysis','AccountBookFilled','Analysis',15,1,0,NULL,'2025-06-04 11:13:55','2025-06-04 11:14:17',NULL),('188611995858112512','188611286865547264','盘点分析','/analysis/asset','AccountBookFilled','xxx',1,1,0,NULL,'2025-06-04 11:16:44','2025-06-04 11:19:05',NULL),('188612252188807168','188611286865547264','流转统计','/analysis/flow','AccountBookFilled','xxx',2,1,0,NULL,'2025-06-04 11:17:45','2025-06-04 11:18:54',NULL),('188612496783839232','188611286865547264','资产状态统计','/analysis/status','AccountBookFilled','xxx',3,1,0,NULL,'2025-06-04 11:18:43','2025-06-04 11:18:43',NULL),('188888002213187584',NULL,'异常信息','/exception','AccountBookFilled','Exception',16,1,0,NULL,'2025-06-05 05:33:29','2025-06-05 05:33:29',NULL),('188888218609913856','188888002213187584','疑似丢失/标签脱落','/exception/lost','AccountBookFilled','lost',1,1,0,NULL,'2025-06-05 05:34:20','2025-08-03 11:54:03',NULL),('188888422541168640','188888002213187584','流转异常','/exception/flow','AccountBookFilled','Flow',2,1,0,NULL,'2025-06-05 05:35:09','2025-06-05 05:35:09',NULL),('188933294094553088',NULL,'车辆监控','/vehicle/monitor','AccountBookFilled','monitor',17,1,0,NULL,'2025-06-05 08:33:27','2025-06-06 01:53:38',NULL),('188933408880070656','188933294094553088','监控','/monitor/monitor','AccountBookFilled','monitormonitor',1,1,0,NULL,'2025-06-05 08:33:54','2025-06-05 08:33:54',NULL),('188933591684616192','188933294094553088','车辆','/monitor/vehicle','AccountBookFilled','MonitorVehicle',2,1,0,NULL,'2025-06-05 08:34:38','2025-06-05 08:34:38',NULL),('189639335119687680',NULL,'基础设置','/base','AccountBookFilled','base',18,1,0,NULL,'2025-06-07 07:19:00','2025-06-07 07:19:00',NULL),('189639599142735872','189639335119687680','资产类型','/base/type','AccountBookFilled','type',2,1,0,NULL,'2025-06-07 07:20:03','2025-06-07 07:22:37',NULL),('189640185057644544','189639335119687680','资产部门','/base/department','AccountBookFilled','department',1,1,0,NULL,'2025-06-07 07:22:23','2025-06-07 07:22:23',NULL),('189690178095288320','189639335119687680','周转线路设置','/base/line','AccountBookFilled','baseLine',3,1,0,NULL,'2025-06-07 10:41:02','2025-06-07 10:41:02',NULL),('189690416130428928','189639335119687680','业务参数设置','/base/arg','AccountBookFilled','baseArg',4,1,0,NULL,'2025-06-07 10:41:59','2025-06-07 10:41:59',NULL),('189690655138648064','189639335119687680','告警通知设置','/base/notice','AccountBookFilled','baseNotice',5,1,0,NULL,'2025-06-07 10:42:56','2025-06-07 10:42:56',NULL),('190037519541211136',NULL,'IOT设备管理','/iot','AccountBookFilled','iot',19,1,0,NULL,'2025-06-08 09:41:15','2025-06-08 09:41:15',NULL),('190037684654182400','190037519541211136','网关管理','/iot/gateway','AccountBookFilled','iotGateway',1,1,0,NULL,'2025-06-08 09:41:54','2025-06-08 09:41:54',NULL),('190047420074168320','190037519541211136','标签管理','/iot/tag','AccountBookFilled','iotTag',2,1,0,NULL,'2025-06-08 10:20:35','2025-06-08 10:20:35',NULL),('190427827726716928',NULL,'资产看板','/panel','AccountBookFilled','panel',10,1,0,NULL,'2025-06-10 02:04:20','2025-06-10 02:04:20',NULL),('40351462613585920',NULL,'系统管理','/system','SettingOutlined','system',21,1,0,NULL,'2024-04-21 17:46:05','2025-07-18 09:03:20',NULL),('40351711566499840','40351462613585920','用户管理','/system/user','UserOutlined','user',1,1,0,'','2024-04-21 17:47:04','2025-07-03 10:57:19',NULL),('40352343601975296','40351462613585920','角色管理','/system/role','MergeOutlined','role',2,1,0,'','2024-04-21 17:49:35','2025-07-03 10:57:19',NULL),('40352749044371456','40351462613585920','部门管理','/system/department','ApartmentOutlined','department',3,1,0,'','2024-04-21 17:51:12','2025-07-03 10:57:19',NULL),('40708567220621312','40351462613585920','菜单管理','/system/menu','FolderOpenOutlined','menu',4,1,0,'','2024-04-22 16:01:18','2025-07-03 10:57:19',NULL),('47973248603787264',NULL,'文件管理','/file','CloudUploadOutlined','File',3,1,0,NULL,'2024-05-12 17:08:33','2025-07-03 10:57:19',NULL),('47975943540576256',NULL,'系统监控','/monitor','CodeOutlined','Monitor',20,1,0,NULL,'2024-05-12 17:19:16','2025-07-18 09:03:32',NULL),('47989353607073792','47975943540576256','操作日志','/monitor/logs','FileDoneOutlined','Logs',1,1,0,NULL,'2024-05-13 09:20:50','2025-07-03 10:57:19',NULL),('47989749788446720','47973248603787264','大文件上传','/file/upload','CloudUploadOutlined','UploadFile',0,1,0,NULL,'2024-05-13 09:22:25','2025-07-03 10:57:19',NULL),('49387228375289856','47975943540576256','定时任务','/monitor/timeTask','ClockCircleOutlined','TimeTask',0,1,0,NULL,'2024-05-16 14:47:12','2025-07-03 10:57:19',NULL);
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `rfid_tags` WRITE;
/*!40000 ALTER TABLE `rfid_tags` DISABLE KEYS */;
INSERT INTO `rfid_tags` VALUES (1,'1111',NULL,1,'发发发hh','2025-08-05 11:44:05','哈哈哈哈'),(3,'呃呃呃呃',NULL,1,'放到v分','2025-02-23 20:34:43','22');
/*!40000 ALTER TABLE `rfid_tags` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('204522831088717824','普通用户','普通用户','2025-07-18 09:00:42','2025-07-18 09:00:42',NULL,1),('37904208560656384','超级管理员','超级管理员，拥有所有权限，不可编辑和删除','2024-04-14 22:17:47','2024-05-09 15:29:08',NULL,1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `roles_interfaces` WRITE;
/*!40000 ALTER TABLE `roles_interfaces` DISABLE KEYS */;
INSERT INTO `roles_interfaces` VALUES ('37904208560656384','37899586299236352'),('37904208560656384','37899744348999680'),('37904208560656384','40696216958275584'),('37904208560656384','41065294818447360'),('37904208560656384','41789444067430400'),('37904208560656384','41903454221766656'),('37904208560656384','41906647861301248'),('37904208560656384','42063400649363456'),('37904208560656384','42071947340681216'),('37904208560656384','42079060825739264'),('37904208560656384','44326032676753408'),('37904208560656384','44332995393359872'),('37904208560656384','44333062707744768'),('37904208560656384','44474438040686592'),('37904208560656384','45864670036234240'),('37904208560656384','46239031234662400'),('37904208560656384','46858901232029696'),('37904208560656384','46859015694585856'),('37904208560656384','46859424727306240'),('37904208560656384','46862379094380544'),('37904208560656384','46862511944765440'),('37904208560656384','46862830229524480'),('37904208560656384','46863099453509632'),('37904208560656384','46863346367991808'),('37904208560656384','46863589419520000'),('37904208560656384','47156442767036416'),('37904208560656384','47216551878725632'),('37904208560656384','47216745617821696'),('37904208560656384','47584267768696832'),('37904208560656384','47593342061514752'),('37904208560656384','47608622313639936'),('37904208560656384','47608882222075904'),('37904208560656384','47973984368594944'),('37904208560656384','47974191147782144'),('37904208560656384','47974424665657344'),('37904208560656384','47974555385335808'),('37904208560656384','47974732070391808'),('37904208560656384','47974990527598592'),('37904208560656384','47975191568977920'),('37904208560656384','47975597174951936'),('37904208560656384','47976243613667328'),('37904208560656384','49391522268844032'),('37904208560656384','49391714045005824'),('37904208560656384','49391851559456768'),('37904208560656384','49392003502313472');
/*!40000 ALTER TABLE `roles_interfaces` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `roles_pages` WRITE;
/*!40000 ALTER TABLE `roles_pages` DISABLE KEYS */;
INSERT INTO `roles_pages` VALUES ('37904208560656384','186756320915886080'),('37904208560656384','187796493954977792'),('37904208560656384','187807279746125824'),('37904208560656384','187807398822416384'),('37904208560656384','188518807294185472'),('37904208560656384','188524722328178688'),('37904208560656384','188525142412890112'),('37904208560656384','188611995858112512'),('37904208560656384','188612252188807168'),('37904208560656384','188612496783839232'),('37904208560656384','188888218609913856'),('37904208560656384','188888422541168640'),('37904208560656384','188933408880070656'),('37904208560656384','188933591684616192'),('37904208560656384','189639599142735872'),('37904208560656384','189640185057644544'),('37904208560656384','189690178095288320'),('37904208560656384','189690416130428928'),('37904208560656384','189690655138648064'),('37904208560656384','190037684654182400'),('37904208560656384','190047420074168320'),('37904208560656384','40351711566499840'),('37904208560656384','40352343601975296'),('37904208560656384','40352749044371456'),('37904208560656384','40708567220621312'),('37904208560656384','47989353607073792'),('37904208560656384','47989749788446720'),('37904208560656384','49387228375289856'),('37904208560656384','40351462613585920'),('37904208560656384','47973248603787264'),('37904208560656384','47975943540576256'),('37904208560656384','187796622602670080'),('37904208560656384','187796749966905344'),('37904208560656384','188611286865547264'),('37904208560656384','188888002213187584'),('37904208560656384','188933294094553088'),('37904208560656384','189639335119687680'),('37904208560656384','190037519541211136'),('37904208560656384','190427827726716928'),('204522831088717824','190037519541211136'),('204522831088717824','190037684654182400'),('204522831088717824','190047420074168320'),('204522831088717824','189639335119687680'),('204522831088717824','189640185057644544'),('204522831088717824','189639599142735872'),('204522831088717824','189690178095288320'),('204522831088717824','189690416130428928'),('204522831088717824','189690655138648064'),('204522831088717824','188933294094553088'),('204522831088717824','188933408880070656'),('204522831088717824','188933591684616192'),('204522831088717824','188888002213187584'),('204522831088717824','188888218609913856'),('204522831088717824','188888422541168640'),('204522831088717824','188611286865547264'),('204522831088717824','188611995858112512'),('204522831088717824','188612252188807168'),('204522831088717824','188612496783839232'),('204522831088717824','187796749966905344'),('204522831088717824','187807279746125824'),('204522831088717824','187807398822416384'),('204522831088717824','187796622602670080'),('204522831088717824','188518807294185472'),('204522831088717824','188524722328178688'),('204522831088717824','188525142412890112'),('204522831088717824','187796493954977792'),('204522831088717824','186756320915886080'),('204522831088717824','190427827726716928'),('204522831088717824','40351462613585920'),('204522831088717824','40351711566499840'),('204522831088717824','40352343601975296'),('204522831088717824','40352749044371456'),('204522831088717824','40708567220621312'),('204522831088717824','47975943540576256'),('204522831088717824','49387228375289856'),('204522831088717824','47989353607073792'),('37904208560656384','1767758404441442'),('204522831088717824','1767758404441442');
/*!40000 ALTER TABLE `roles_pages` ENABLE KEYS */;
UNLOCK TABLES;
DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `store_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '场库编号',
  `garden_id` int DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='场库信息';
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (4,'12库',4),(5,'14库',4),(14,'16库',4);
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;
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

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('34980631960096768','admin','$2a$10$xF3Zg4fby10w.pBjcsJA0.9eikP3agRF3PpBl9Dgw3xBI2MREXZ26','超级管理员',NULL,'2024-04-23 15:40:14','2025-12-25 09:09:59',NULL,1,NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
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
