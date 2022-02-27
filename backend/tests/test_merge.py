from flask import json
from flaskr.models import Company, Document, Tag


def generate_Tag():
    tag = Tag()
    tag.user_id = "hoge"
    tag.id = "hoge"
    tag.name = "hoge"
    tag.update_date = 12345
    return tag


def generate_data(update_date, new_name):
    date_str = str(update_date)
    company_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": new_name,
            "updateDate": update_date,
        }
    ]
    tag_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": new_name,
            "updateDate": update_date,
        }
    ]
    document_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": new_name,
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


def test_merge(client, client2, session):
    client.get("/test/login")

    latest_uuid_data = json.dumps({"latestUuid": "abcdefg"})
    response = client.post(
        "/merge/", data=latest_uuid_data, content_type="application/json"
    )
    assert response.get_json()["must_merge"] == True
    assert response.status_code == 200

    response = client.post(
        "/merge/sync", data=generate_data(1111, "hoge"), content_type="application/json"
    )
    assert response.status_code == 200
    assert Document.query.first().name == "hoge"
    assert Tag.query.first().name == "hoge"
    assert Company.query.first().name == "hoge"

    response = client.post(
        "/merge/sync",
        data=generate_data(2222, "hoge2"),
        content_type="application/json",
    )
    assert response.status_code == 200
    assert Tag.query.first().name == "hoge2"
    assert Company.query.first().name == "hoge2"
    assert Document.query.first().name == "hoge2"
