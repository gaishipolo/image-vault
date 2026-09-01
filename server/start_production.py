#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
ImageVault 生产环境启动脚本
使用 waitress WSGI 服务器（Windows 兼容）
"""

import os
import sys

# 设置环境变量
os.environ['FLASK_ENV'] = 'production'

# 确保在正确的目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def main():
    try:
        from waitress import serve
        from app import create_app

        app = create_app('production')

        host = os.getenv('HOST', '0.0.0.0')
        port = int(os.getenv('PORT', '5000'))

        print("=" * 50)
        print("ImageVault Production Server")
        print("=" * 50)
        print(f"Server: http://{host}:{port}")
        print(f"Frontend: {app.static_folder}")
        print("=" * 50)
        print("Press Ctrl+C to stop")
        print()

        serve(app, host=host, port=port, threads=8)

    except ImportError:
        print("Error: waitress not installed")
        print("Run: pip install waitress")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
