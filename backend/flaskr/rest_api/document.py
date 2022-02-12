from cgitb import text
from datetime import datetime, timedelta
from locale import currency
from pydoc import doc
from unicodedata import name

from flask import Blueprint, Response, request
from flask_login import current_user, login_required

from .. import db
from ..models import Document

bp = Blueprint('document', __name__, url_prefix='/document')


@bp.route("/", methods=['GET'])
@login_required
def get_list():
    return Response(current_user.email)


@bp.route("/", methods=['POST'])
@login_required
def regest():
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
        return Response(payload.get('tagId'))

    db.session.add(document)
    db.session.commit()
    return Response("登録完了")


@bp.route("/<int:id>", methods=['GET'])
@login_required
def get():
    return Response(current_user.email)


@bp.route("/<int:id>", methods=['POST'])
@login_required
def update():
    return Response(current_user.email)


@bp.route("/<int:id>", methods=['DELETE'])
@login_required
def delete():
    return Response(current_user.email)
