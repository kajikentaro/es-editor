from flask import json
from flaskr.models import Company, Document, DocumentHistory, Tag
from flaskr.utils.random_id import gen_random_local_id


def gen_sample_data(update_date, item_name, item_id):
    company_list = [
        {
            "id": item_id,
            "name": item_name,
            "updateDate": update_date,
        }
    ]
    tag_list = [
        {
            "id": item_id,
            "name": item_name,
            "updateDate": update_date,
        }
    ]
    document_history_list = [
        {
            "id": item_id,
            "documentId": gen_random_local_id(),
            "name": item_name,
            "companyId": "hoge",
            "tagId": "hoge",
            "text": "hoge history",
            "wordCount": 123,
            "updateDate": update_date,
        }
    ]
    document_list = [
        {
            "id": item_id,
            "historyId": gen_random_local_id(),
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
            "document": document_list,
            "tag": tag_list,
            "company": company_list,
            "history": document_history_list,
        }
    )
    return data


def test_latest_uuid(client, transaction):
    client.get("/test/login")

    # 初回アクセス時
    latest_uuid_data = json.dumps({"latestUuid": "abcdefg"})
    response = client.post(
        "/merge/", data=latest_uuid_data, content_type="application/json"
    )
    assert response.get_json()["mustMerge"] == True
    assert response.status_code == 200

    # TODO: データを投入しUUIDの変化を確認する


def test_merge(client, transaction):
    client.get("/test/login")

    item_id = gen_random_local_id()
    # 初期データ投入
    response = client.post(
        "/merge/sync",
        data=gen_sample_data(1111, "hoge", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Document.query.filter_by(id=item_id, name="hoge").one_or_none()
    assert Tag.query.filter_by(id=item_id, name="hoge").one_or_none()
    assert Company.query.filter_by(id=item_id, name="hoge").one_or_none()
    assert DocumentHistory.query.filter_by(name="hoge").one_or_none()

    # 新しいデータを投入
    response = client.post(
        "/merge/sync",
        data=gen_sample_data(2222, "hoge2", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Tag.query.filter_by(id=item_id, name="hoge2").one_or_none()
    assert Company.query.filter_by(id=item_id, name="hoge2").one_or_none()
    assert Document.query.filter_by(id=item_id, name="hoge2").one_or_none()

    # 古いデータを投入
    response = client.post(
        "/merge/sync",
        data=gen_sample_data(10, "hoge3", item_id),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Tag.query.filter_by(id=item_id, name="hoge2").one_or_none()
    assert Company.query.filter_by(id=item_id, name="hoge2").one_or_none()
    assert Document.query.filter_by(id=item_id, name="hoge2").one_or_none()
