from flask import json
from flaskr.models import Company, Document, DocumentHistory, Tag
from flaskr.utils.random_id import gen_random_local_id


def generate_Tag():
    tag = Tag()
    tag.user_id = "hoge"
    tag.id = "hoge"
    tag.name = "hoge"
    tag.update_date = 12345
    return tag


def generate_data(update_date, item_name, item_id):
    company_list = [
        {
            "user_id": "hoge",
            "id": item_id,
            "name": item_name,
            "updateDate": update_date,
        }
    ]
    tag_list = [
        {
            "user_id": "hoge",
            "id": item_id,
            "name": item_name,
            "updateDate": update_date,
        }
    ]
    document_list = [
        {
            "user_id": "hoge",
            "id": item_id,
            "name": item_name,
            "companyId": "hoge",
            "tagId": "hoge",
            "text": "hoge",
            "wordCount": 123,
            "updateDate": update_date,
        }
    ]
    data = json.dumps(
        {
            "documentList": document_list,
            "tagList": tag_list,
            "companyList": company_list,
            "documentHistoryList": [],
        }
    )
    return data


def test_latest_uuid(client, session):
    client.get("/test/login")

    # 初回アクセス時
    latest_uuid_data = json.dumps({"latestUuid": "abcdefg"})
    response = client.post(
        "/merge/", data=latest_uuid_data, content_type="application/json"
    )
    assert response.get_json()["must_merge"] == True
    assert response.status_code == 200

    # TODO: データを投入しUUIDの変化を確認する


def test_merge(client, client2, session):
    client.get("/test/login")

    item_id = gen_random_local_id()
    # 初期データ投入
    response = client.post(
        "/merge/sync",
        data=generate_data(1111, "hoge", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Document.query.filter_by(id=item_id).one_or_none().name == "hoge"
    assert Tag.query.filter_by(id=item_id).one_or_none().name == "hoge"
    assert Company.query.filter_by(id=item_id).one_or_none().name == "hoge"

    # 新しいデータを投入
    response = client.post(
        "/merge/sync",
        data=generate_data(2222, "hoge2", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Tag.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert Company.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert Document.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert DocumentHistory.query.filter_by(
        document_id=item_id, name="hoge"
    ).one_or_none()

    # 古いデータを投入
    response = client.post(
        "/merge/sync",
        data=generate_data(10, "hoge3", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Tag.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert Company.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert Document.query.filter_by(id=item_id).one_or_none().name == "hoge2"
    assert DocumentHistory.query.filter_by(
        document_id=item_id, name="hoge3"
    ).one_or_none()
