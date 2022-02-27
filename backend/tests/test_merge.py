from flask import json
from flaskr.models import Document, Tag


def generate_Tag():
    tag = Tag()
    tag.user_id = "hoge"
    tag.id = "hoge"
    tag.name = "hoge"
    tag.update_date = 12345
    return tag


def generate_data(update_date):
    date_str = str(update_date)
    company_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": "hoge" + date_str,
            "updateDate": update_date,
        }
    ]
    tag_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": "hoge" + date_str,
            "updateDate": update_date,
        }
    ]
    document_list = [
        {
            "user_id": "hoge",
            "id": "hoge",
            "name": "hoge",
            "companyId": "hoge",
            "tagId": "hoge",
            "text": "hoge" + date_str,
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
        "/merge/sync", data=generate_data(1111), content_type="application/json"
    )
    assert response.status_code == 200

    print(Document.query.first().text)
