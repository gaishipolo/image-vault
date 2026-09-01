-- 高私密性图片管理系统 - 数据库设计

-- 管理员表（唯一账号）
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 图片表（存储加密后的密文）
CREATE TABLE images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
    mime_type VARCHAR(100) NOT NULL COMMENT '原始MIME类型',
    file_size BIGINT NOT NULL COMMENT '原始文件大小（字节）',
    encrypted_data LONGBLOB NOT NULL COMMENT '加密后的图片数据',
    iv VARCHAR(64) NOT NULL COMMENT 'AES初始化向量',
    description TEXT COMMENT '图片描述',
    tags VARCHAR(500) COMMENT '标签（逗号分隔）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_original_filename (original_filename)
);

-- 初始管理员账号（密码需要在应用中 bcrypt 加密后存储）
-- INSERT INTO admin (username, password_hash)
-- VALUES ('admin', '<bcrypt_hash>');
