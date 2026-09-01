#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ImageVault 数据库初始化脚本
使用 conda py312 环境运行
"""

import pymysql
import sys
import os
from dotenv import load_dotenv

# 设置控制台编码为 UTF-8
os.system('chcp 65001 >nul 2>&1')

load_dotenv()

# 数据库配置 -- 从环境变量读取，避免硬编码
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': int(os.getenv('DB_PORT', '3306')),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'charset': 'utf8mb4'
}

DATABASE_NAME = 'image_vault'

# SQL 语句
SQL_STATEMENTS = [
    # 创建数据库
    f"""
    CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci
    """,

    # 使用数据库
    f"USE {DATABASE_NAME}",

    # 管理员表
    """
    CREATE TABLE IF NOT EXISTS admin (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(64) NOT NULL UNIQUE,
        password_hash VARCHAR(256) NOT NULL COMMENT 'Argon2id 哈希',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """,

    # 图片表
    """
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    """
]


def main():
    print("=" * 50)
    print("ImageVault Database Initialization")
    print("=" * 50)

    connection = None
    try:
        # 连接 MySQL
        print(f"\n[1/4] Connecting to MySQL ({DB_CONFIG['host']}:{DB_CONFIG['port']})...")
        connection = pymysql.connect(**DB_CONFIG)
        cursor = connection.cursor()
        print("      OK - Connected")

        # 执行 SQL 语句
        for i, sql in enumerate(SQL_STATEMENTS, 1):
            sql_trimmed = sql.strip()
            if not sql_trimmed:
                continue

            # 提取语句描述
            if 'CREATE DATABASE' in sql_trimmed:
                desc = f"Create database '{DATABASE_NAME}'"
            elif 'USE ' in sql_trimmed:
                desc = f"Switch to database '{DATABASE_NAME}'"
            elif 'CREATE TABLE' in sql_trimmed:
                table_name = sql_trimmed.split('CREATE TABLE IF NOT EXISTS')[1].split('(')[0].strip()
                desc = f"Create table '{table_name}'"
            else:
                desc = f"Execute SQL #{i}"

            print(f"\n[{i+1}/4] {desc}...")
            try:
                cursor.execute(sql_trimmed)
                print(f"      OK - Done")
            except pymysql.Error as e:
                if 'already exists' in str(e).lower():
                    print(f"      OK - Already exists, skipped")
                else:
                    raise

        # 验证表结构
        print(f"\n[5/5] Verifying tables...")
        cursor.execute(f"USE {DATABASE_NAME}")

        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        print(f"      Tables in '{DATABASE_NAME}':")
        for table in tables:
            print(f"        - {table[0]}")

        # 显示 admin 表结构
        print("\n      admin table structure:")
        cursor.execute("DESCRIBE admin")
        for row in cursor.fetchall():
            print(f"        {row[0]:20} {row[1]:30}")

        # 显示 images 表结构
        print("\n      images table structure:")
        cursor.execute("DESCRIBE images")
        for row in cursor.fetchall():
            print(f"        {row[0]:20} {row[1]:30}")

        connection.commit()
        print("\n" + "=" * 50)
        print("SUCCESS - Database initialized!")
        print("=" * 50)

    except pymysql.Error as e:
        print(f"\nERROR - Database error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\nERROR - Unexpected error: {e}")
        sys.exit(1)
    finally:
        if connection:
            connection.close()
            print("\nDatabase connection closed")


if __name__ == '__main__':
    main()
