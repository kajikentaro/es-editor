from cgitb import text
from datetime import datetime, timedelta
from locale import currency
from pydoc import doc
from unicodedata import name
from zlib import DEF_MEM_LEVEL

from flask import Blueprint, Response, jsonify, request
from flask_login import current_user, login_required
from flaskr.utils.client_uuid import update_uuid
from flaskr.utils.random_id import gen_random_local_id

from .. import db
from ..models import DeletedHistory, Document, DocumentHistory, DocumentSchema

bp = Blueprint("document", __name__, url_prefix="/document")


@bp.route("/", methods=["GET"])
@login_required
def get_list():
    document_schema = DocumentSchema(many=True)
    data = document_schema.dump(
        Document.query.filter_by(user_id=current_user.user_id).all()
    )
    return jsonify(data)


# 新規登録orアップデート
@bp.route("/", methods=["POST"])
@login_required
def post():
    payload = request.json

    payload_document = {}
    payload_document["id"] = payload.get("id")
    payload_document["name"] = payload.get("name")
    payload_document["historyId"] = payload.get("historyId")
    payload_document["companyId"] = payload.get("companyId")
    payload_document["tagId"] = payload.get("tagId")
    payload_document["text"] = payload.get("text")
    payload_document["wordCount"] = payload.get("wordCount")
    payload_document["updateDate"] = payload.get("updateDate")
    payload_document["userId"] = current_user.user_id

    update_document(payload_document)

    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({"uuid": update_uuid()})


@bp.route("/<string:id>", methods=["DELETE"])
@login_required
def delete(id):
    target = Document.query.filter_by(user_id=current_user.user_id, id=id).one_or_none()
    if not target:
        return jsonify({"message": "存在しないドキュメントです"}), 400
    db.session.delete(target)

    _unix_sec = (datetime.utcnow() + timedelta(hours=9)).timestamp()

    deleted_document = DeletedHistory()
    deleted_document.user_id = current_user.user_id
    deleted_document.id = id
    deleted_document.update_date = int(_unix_sec * 1000)
    db.session.add(deleted_document)

    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({})


def update_document(input_document: dict, is_save_history=True):
    if is_save_history:
        document_history = DocumentHistory()
        document_history.id = input_document.get("historyId", gen_random_local_id())
        document_history.document_id = input_document["id"]
        document_history.name = input_document["name"]
        document_history.company_id = input_document["companyId"]
        document_history.tag_id = input_document["tagId"]
        document_history.text = input_document["text"]
        document_history.word_count = input_document["wordCount"]
        document_history.update_date = input_document["updateDate"]
        document_history.user_id = current_user.user_id
        db.session.add(document_history)

    saved_document = Document.query.filter_by(
        user_id=current_user.user_id, id=input_document["id"]
    ).one_or_none()

    # saved_documentが存在しない場合
    if saved_document == None:
        saved_document = Document()
        saved_document.update_date = input_document["updateDate"]

    print(input_document)
    # input_documentのほうが古い場合は何もしない
    if input_document["updateDate"] < saved_document.update_date:
        return

    saved_document.id = input_document["id"]
    saved_document.name = input_document["name"]
    saved_document.history_id = input_document.get("historyId", gen_random_local_id())
    saved_document.company_id = input_document["companyId"]
    saved_document.tag_id = input_document["tagId"]
    saved_document.text = input_document["text"]
    saved_document.word_count = input_document["wordCount"]
    saved_document.update_date = input_document["updateDate"]
    saved_document.user_id = current_user.user_id
    db.session.add(saved_document)
