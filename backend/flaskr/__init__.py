import os

from dotenv import load_dotenv
from flask import Flask
from flask_login import (LoginManager, UserMixin, current_user, login_required,
                         login_user, logout_user)
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path, verbose=True)

db = SQLAlchemy()
login_manager = LoginManager()
ma = Marshmallow()


def create_app(is_test=False):
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://{user}:{password}@{host}/{db_name}".format(**{
        'user': os.environ.get('RDS_USER', None),
        'password': os.environ.get('RDS_PASS', None),
        'host': os.environ.get('RDS_HOST', None),
        'db_name': os.environ.get('RDS_DB_NAME' if is_test else "RDS_DB_NAME", None)
    })
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY") or os.urandom(24)
    app.config['JSON_AS_ASCII'] = False

    db.init_app(app)
    login_manager.init_app(app)
    ma.init_app(app)

    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from .rest_api.document import bp as document_bp
    app.register_blueprint(document_bp)

    with app.app_context():
        db.create_all()

    return app
