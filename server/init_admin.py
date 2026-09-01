"""CLI script -- create or reset an administrator account.

Usage
-----
    # Interactive (prompts for username and password):
    python init_admin.py

    # Non-interactive:
    python init_admin.py --username admin --password s3cret

    # Reset password for an existing admin:
    python init_admin.py --username admin --password newpass --reset
"""

import argparse
import getpass
import sys

from app import create_app
from models import db, Admin


def main() -> None:
    parser = argparse.ArgumentParser(description="Create or reset an admin account.")
    parser.add_argument("--username", "-u", help="Admin username")
    parser.add_argument("--password", "-p", help="Admin password (will prompt if omitted)")
    parser.add_argument("--reset", action="store_true", help="Reset password if user already exists")
    args = parser.parse_args()

    app = create_app()
    with app.app_context():
        # Ensure tables exist
        db.create_all()

        username = args.username or input("Username: ").strip()
        if not username:
            print("Error: username cannot be empty.", file=sys.stderr)
            sys.exit(1)

        password = args.password or getpass.getpass("Password: ")
        confirm = args.password or getpass.getpass("Confirm password: ")
        if password != confirm:
            print("Error: passwords do not match.", file=sys.stderr)
            sys.exit(1)

        existing = Admin.query.filter_by(username=username).first()

        if existing and not args.reset:
            print(
                f"Error: admin '{username}' already exists. Use --reset to change password.",
                file=sys.stderr,
            )
            sys.exit(1)

        if existing and args.reset:
            existing.set_password(password)
            db.session.commit()
            print(f"Password for admin '{username}' has been reset.")
            return

        admin = Admin(username=username)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin '{username}' created successfully (id={admin.id}).")


if __name__ == "__main__":
    main()
