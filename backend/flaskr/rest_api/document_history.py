from cgitb import text
from datetime import datetime, timedelta
from locale import currency
from pydoc import doc
from unicodedata import name
from zlib import DEF_MEM_LEVEL

from flask import Blueprint, Response, jsonify, request
from flask_login import current_user, login_required

from .. import db
from ..models import DeletedHistory, Document, DocumentHistory, DocumentSchema


def update_document_history(input_document_history: dict):
    saved_document_history = DocumentHistory.query.filter_by(
        user_id=current_user.user_id, id=input_document_history["id"]
    ).one_or_none()
    if saved_document_history:
        return

    document_history = DocumentHistory()
    document_history.id = input_document_history["id"]
    document_history.document_id = input_document_history["documentId"]
    document_history.name = input_document_history["name"]
    document_history.company_id = input_document_history["companyId"]
    document_history.tag_id = input_document_history["tagId"]
    document_history.text = input_document_history["text"]
    document_history.word_count = input_document_history["wordCount"]
    document_history.update_date = input_document_history["updateDate"]
    document_history.user_id = current_user.user_id
    db.session.add(document_history)
