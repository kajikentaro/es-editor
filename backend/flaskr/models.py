from flask_login import (LoginManager, UserMixin, current_user, login_required,
                         login_user, logout_user)

from . import db


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    unique_id = db.Column(db.String(120), unique=True)
    username = db.Column(db.String(120))
    email = db.Column(db.String(120))

    def __init__(self, unique_id, username, email):
        self.unique_id = unique_id
        self.username = username
        self.email = email
