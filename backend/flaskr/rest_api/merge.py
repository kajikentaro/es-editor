from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flask_sqlalchemy import model
from flaskr.utils.client_uuid import update_uuid

from .. import db
from ..models import (Company, CompanySchema, DeletedHistory,
                      DeletedHistorySchema, Document, DocumentHistory,
                      DocumentHistorySchema, DocumentSchema, Tag, TagSchema)
from .company import update_company
from .document import update_document
from .document_history import update_document_history
from .tag import update_tag

bp = Blueprint("merge", __name__, url_prefix="/merge")


@bp.route("/", methods=["POST"])
@login_required
def is_latest_client():
    payload = request.json

    client_uuid = payload.get("latestUuid")
    return jsonify(
        {
            "mustMerge": current_user.latest_uuid != client_uuid,
            "latestUuid": current_user.latest_uuid,
        }
    )


@bp.route("/sync", methods=["POST"])
@login_required
def sync_data():
    payload = request.json

    document_list = payload.get("document")
    document_history_list = payload.get("history")
    tag_list = payload.get("tag")
    company_list = payload.get("company")

    users_deleted_history = DeletedHistory.query.filter_by(user_id=current_user.user_id)

    def filter_deleted_item(item_list):
        for idx, item in enumerate(item_list):
            if users_deleted_history.filter_by(id=item["id"]).one_or_none():
                item_list.pop(idx)

    filter_deleted_item(document_list)
    filter_deleted_item(tag_list)
    filter_deleted_item(company_list)

    for document in document_list:
        update_document(document, False)
    for tag in tag_list:
        update_tag(tag)
    for company in company_list:
        update_company(company)

    for document_history in document_history_list:
        update_document_history(document_history)

    db.session.commit()
    return jsonify({"uuid": update_uuid()})


@bp.route("/download")
@login_required
def get_all():
    res = {
        "document": DocumentSchema(many=True).dump(
            Document.query.filter_by(user_id=current_user.user_id).all()
        ),
        "tag": TagSchema(many=True).dump(
            Tag.query.filter_by(user_id=current_user.user_id).all()
        ),
        "company": CompanySchema(many=True).dump(
            Company.query.filter_by(user_id=current_user.user_id).all()
        ),
        "history": DocumentHistorySchema(many=True).dump(
            DocumentHistory.query.filter_by(user_id=current_user.user_id).all()
        ),
        "deleted": DeletedHistorySchema(many=True).dump(
            DeletedHistory.query.filter_by(user_id=current_user.user_id).all()
        ),
    }
    return jsonify(res)


@bp.route("/check_login", methods=["POST"])
def check_login():
    payload = request.json

    if current_user.is_authenticated:
        client_uuid = payload.get("latestUuid")
        return jsonify(
            {
                "message": "ログイン中",
                "isLogin": True,
                "userId": current_user.user_id,
                "latestUuid": current_user.latest_uuid,
                "mustMerge": current_user.latest_uuid != client_uuid,
            }
        )
    else:
        return jsonify(
            {
                "message": "ログアウト中",
                "isLogin": False,
            }
        )
