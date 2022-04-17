from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flaskr.utils.client_uuid import update_uuid

from .. import db
from ..models import (DeletedHistory, Document, DocumentHistory,
                      DocumentSchema, Tag)

bp = Blueprint("tag", __name__, url_prefix="/tag")


@bp.route("/", methods=["GET"])
@login_required
def get_list():
    document_schema = DocumentSchema(many=True)
    data = document_schema.dump(
        Document.query.filter_by(user_id=current_user.user_id).all()
    )
    return jsonify(data)


# save and update
@bp.route("/", methods=["POST"])
@login_required
def post():
    payload = request.json

    payload_tag = {}
    payload_tag["id"] = payload.get("id")
    payload_tag["name"] = payload.get("name")
    payload_tag["updateDate"] = payload.get("updateDate")
    payload_tag["userId"] = current_user.user_id

    update_tag(payload_tag)

    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({"uuid": update_uuid()})


@bp.route("/<string:id>", methods=["DELETE"])
@login_required
def delete(id):
    target = Tag.query.filter_by(user_id=current_user.user_id, id=id).one_or_none()
    if target == None:
        return jsonify({"message": "存在しないドキュメントです"}), 400
    db.session.delete(target)

    deleted_history = DeletedHistory()
    deleted_history.user_id = current_user.user_id
    deleted_history.id = id
    deleted_history.update_date = (datetime.utcnow() + timedelta(hours=9)).timestamp()
    db.session.add(deleted_history)
    
    db.session.commit()

    return jsonify({"uuid": update_uuid()})


def update_tag(input_tag: dict):
    tag = Tag.query.filter_by(
        user_id=current_user.user_id, id=input_tag["id"]
    ).one_or_none()

    if tag == None:
        tag = Tag()
        tag.update_date = input_tag["updateDate"]

    if input_tag["updateDate"] < tag.update_date:
        return

    tag.id = input_tag["id"]
    tag.name = input_tag["name"]
    tag.update_date = input_tag["updateDate"]
    tag.user_id = current_user.user_id
    db.session.add(tag)
