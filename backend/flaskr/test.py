from flask import Blueprint, Response, jsonify, redirect
from flask_login import current_user, login_user

from flaskr.models import User

from . import db

bp = Blueprint("test", __name__, url_prefix="/test")


@bp.route("/login", methods=["GET"])
def login():
    user = User(user_id=1111, user_name="sato", email="testacounts890@gmail.com")
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return jsonify({})


@bp.route("/is_login")
def is_login():
    if current_user.is_authenticated:
        print(current_user)
        return Response("ログイン中" + current_user.user_id)
    return Response("ログアウト中"), 400


@bp.route("/is_logout")
def is_logout():
    if current_user.is_authenticated:
        print(current_user)
        return Response("ログイン中" + current_user.user_id), 400
    return Response("ログアウト中")
