-- ImageVault 数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS image_vault
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE image_vault;

-- 管理员表（唯一账号）
CREATE TABLE IF NOT EXISTS admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(256) NOT NULL COMMENT 'Argon2id 哈希',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 图片表（存储加密密文）
CREATE TABLE IF NOT EXISTS images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
    mime_type VARCHAR(64) NOT NULL COMMENT 'MIME 类型',
    file_size BIGINT NOT NULL COMMENT '原始文件大小（字节）',
    encrypted_data LONGBLOB NOT NULL COMMENT 'AES 加密后的图片数据',
    iv VARCHAR(64) NOT NULL COMMENT 'AES 初始化向量（十六进制）',
    description TEXT COMMENT '图片描述',
    tags VARCHAR(512) COMMENT '标签（逗号分隔）',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_original_filename (original_filename),
    INDEX idx_mime_type (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 显示表结构
DESCRIBE admin;
DESCRIBE images;
