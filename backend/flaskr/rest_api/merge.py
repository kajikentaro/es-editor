from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flask_sqlalchemy import model

from .. import db
from ..models import Company, DeletedHistory, Document, DocumentHistory, Tag

bp = Blueprint("merge", __name__, url_prefix="/merge")


@bp.route("/", methods=["POST"])
@login_required
def is_latest_client():
    payload = request.json

    client_uuid = payload.get("latestUuid")
    return jsonify({"must_merge": current_user.latest_uuid != client_uuid})


@bp.route("/sync", methods=["POST"])
@login_required
def sync_data():
    payload = request.json

    document_list = payload.get("documentList")
    document_history_list = payload.get("documentHistoryList")
    tag_list = payload.get("tagList")
    company_list = payload.get("companyList")

    users_deleted_history = DeletedHistory.query.filter_by(user_id=current_user.user_id)

    def filter_deleted_item(item_list):
        for idx, item in enumerate(item_list):
            if users_deleted_history.filter_by(id=item["id"]).one_or_none():
                item_list.pop(idx)

    filter_deleted_item(document_list)
    filter_deleted_item(document_history_list)
    filter_deleted_item(tag_list)
    filter_deleted_item(company_list)

    def update_item(item_dict_list, model: model):
        for item_dict in item_dict_list:
            target = model.query.filter_by(id=item_dict["id"]).one_or_none()
            if not target:
                target = model()
            is_success = target.init_from_dict(item_dict, current_user.user_id)
            if is_success:
                db.session.add(target)

    update_item(document_history_list, DocumentHistory)
    update_item(tag_list, Tag)
    update_item(company_list, Company)

    for item_dict in document_list:
        target = Document.query.filter_by(id=item_dict["id"]).one_or_none()
        if not item_dict.get("updateDate"):
            item_dict["updateDate"] = 1

        if not target:
            target = Document()
            target.init_from_dict(item_dict, current_user.user_id)
            db.session.add(target)
            break

        db.session.delete(target)
        old_item = Document()
        old_item.init_from_dict(item_dict, current_user.user_id)
        if target.update_date < old_item.update_date:
            old_item, target = target, old_item

        db.session.add(target)

        history_item = DocumentHistory()
        history_item.init_from_document(old_item)
        db.session.add(history_item)

    db.session.commit()
    return jsonify({})
