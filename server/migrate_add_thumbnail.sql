-- 添加缩略图字段到现有数据库
USE image_vault;

ALTER TABLE images
ADD COLUMN encrypted_thumbnail MEDIUMBLOB COMMENT '加密缩略图' AFTER iv,
ADD COLUMN thumbnail_iv VARCHAR(64) COMMENT '缩略图 IV' AFTER encrypted_thumbnail;
