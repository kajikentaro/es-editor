from uuid import uuid4

from flask import Blueprint, Response, jsonify, redirect, request
from flask_login import current_user, login_required, login_user

from flaskr.models import (
    Company,
    CompanySchema,
    DeletedHistory,
    DeletedHistorySchema,
    Document,
    DocumentHistory,
    DocumentHistorySchema,
    DocumentSchema,
    Tag,
    TagSchema,
    User,
)
from flaskr.utils.client_uuid import update_uuid

from . import db

bp = Blueprint("test", __name__, url_prefix="/test")


@bp.route("/login", methods=["GET"])
def login():
    user = User.query.filter_by(user_id=1111).one_or_none()
    if not user:
        user = User(user_id=1111, user_name="sato", email="testacounts890@gmail.com")
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return jsonify({})


@bp.route("/is_login", methods=["GET"])
def is_login():
    if current_user.is_authenticated:
        return jsonify(
            {
                "message": "ログイン中",
                "isLogin": True,
                "userId": current_user.user_id,
                "latestUuid": current_user.latest_uuid,
            }
        )
    else:
        return jsonify(
            {
                "message": "ログアウト中",
                "isLogin": False,
            }
        )


@bp.route("/drop_all")
@login_required
def drop_all():
    Document.query.filter_by(user_id=current_user.user_id).delete()
    Company.query.filter_by(user_id=current_user.user_id).delete()
    Tag.query.filter_by(user_id=current_user.user_id).delete()
    DocumentHistory.query.filter_by(user_id=current_user.user_id).delete()

    return jsonify({"uuid": str(uuid4())})
