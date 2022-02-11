import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_pyfile("config.py")

    db.init_app(app)

    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    return app
