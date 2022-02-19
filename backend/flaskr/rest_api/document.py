from cgitb import text
from datetime import datetime, timedelta
from locale import currency
from pydoc import doc
from unicodedata import name
from zlib import DEF_MEM_LEVEL

from flask import Blueprint, Response, jsonify, request
from flask_login import current_user, login_required

from .. import db
from ..models import DeletedDocument, Document, DocumentSchema

bp = Blueprint('document', __name__, url_prefix='/document')


@bp.route("/", methods=['GET'])
@login_required
def get_list():
    document_schema = DocumentSchema(many=True)
    data = document_schema.dump(Document.query.filter_by(
        user_id=current_user.user_id).all())
    return jsonify(data)


# 新規登録orアップデート
@bp.route("/", methods=['POST'])
@login_required
def post():
    payload = request.json
    _unix_sec = (datetime.utcnow() + timedelta(hours=9)).timestamp()

    document = Document()
    document.id = payload.get('id')
    document.name = payload.get('name')
    document.company_id = payload.get('companyId')
    document.tag_id = payload.get('tagId')
    document.text = payload.get('text')
    document.word_count = payload.get('wordCount')
    document.update_date = int(_unix_sec * 1000)
    document.user_id = current_user.user_id

    if Document.query.filter_by(user_id=document.user_id, id=document.id).one_or_none():
        # TODO: アップデートして履歴に保存する処理
        return jsonify({})

    db.session.add(document)
    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({})


@bp.route("/<int:id>", methods=['DELETE'])
@login_required
def delete():
    payload = request.json
    document_id = payload.get('id')

    target = Document.query.filter_by(
        user_id=current_user.user_id, id=document_id).one_or_none()
    if not target:
        return jsonify({"message": "存在しないドキュメントです"}), 400
    db.session.delete(target)

    _unix_sec = (datetime.utcnow() + timedelta(hours=9)).timestamp()

    deleted_document = DeletedDocument()
    deleted_document.user_id = current_user.user_id
    deleted_document.id = document_id
    deleted_document.update_date = int(_unix_sec * 1000)

    db.session.add(deleted_document)
    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({})
