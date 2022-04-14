from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flaskr.utils.client_uuid import save_uuid

from .. import db
from ..models import Document, DocumentSchema, Tag

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
    _unix_sec = (datetime.utcnow() + timedelta(hours=9)).timestamp()

    payload_tag = {}
    payload_tag["id"] = payload.get("id")
    payload_tag["name"] = payload.get("name")
    payload_tag["updateDate"] = payload.get("updateDate")
    payload_tag["userId"] = current_user.user_id

    update_tag(payload_tag)

    latest_uuid = save_uuid(current_user, db)
    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({"latest_uuid": latest_uuid})


@bp.route("/<string:id>", methods=["DELETE"])
@login_required
def delete(id):
    target = Tag.query.filter_by(user_id=current_user.user_id, id=id).one_or_none()
    if target == None:
        return jsonify({"message": "存在しないドキュメントです"}), 400
    db.session.delete(target)
    db.session.commit()

    return jsonify({})


def update_tag(input_tag: dict):
    tag = Tag()
    tag.id = input_tag["id"]
    tag.name = input_tag["name"]
    tag.update_date = input_tag["updateDate"]
    tag.user_id = input_tag["userId"]
    db.session.add(tag)
