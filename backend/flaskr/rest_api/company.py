from datetime import datetime, timedelta

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from flaskr.utils.client_uuid import save_uuid

from .. import db
from ..models import Company, Document, DocumentSchema

bp = Blueprint("company", __name__, url_prefix="/company")


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

    payload_company = {}
    payload_company["id"] = payload.get("id")
    payload_company["name"] = payload.get("name")
    payload_company["updateDate"] = payload.get("updateDate")
    payload_company["userId"] = current_user.user_id

    update_company(payload_company)

    latest_uuid = save_uuid(current_user, db)
    try:
        db.session.commit()
    except:
        return jsonify({"message": "サーバーのDB書き込みに失敗しました"}), 400
    return jsonify({"latest_uuid": latest_uuid})


@bp.route("/<string:id>", methods=["DELETE"])
@login_required
def delete(id):
    target = Company.query.filter_by(user_id=current_user.user_id, id=id).one_or_none()
    if target == None:
        return jsonify({"message": "存在しないドキュメントです"}), 400
    db.session.delete(target)
    db.session.commit()

    return jsonify({})


def update_company(input_company: dict):
    company = Company.query.filter_by(
        user_id=current_user.user_id, id=input_company["id"]
    ).one_or_none()

    if company == None:
        company = Company()
        company.update_date = input_company["updateDate"]

    if input_company["updateDate"] < company.update_date:
        return

    company.id = input_company["id"]
    company.name = input_company["name"]
    company.update_date = input_company["updateDate"]
    company.user_id = current_user.user_id
    db.session.add(company)
