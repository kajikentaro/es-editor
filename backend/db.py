import os

from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)
load_dotenv(verbose=True)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://{user}:{password}@{host}/{db_name}".format(**{
    'user': os.environ.get('RDS_USER', None),
    'password': os.environ.get('RDS_PASS', None),
    'host': os.environ.get('RDS_HOST', None),
    'db_name': os.environ.get('RDS_DB_NAME', None)
})
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY") or os.urandom(24)


db = SQLAlchemy(app)
with app.app_context():
    db.create_all()



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)

    def __init__(self, username, email):
        self.username = username
        self.email = email

    def __repr__(self):
        return '<User %r>' % self.username


db.create_all()
