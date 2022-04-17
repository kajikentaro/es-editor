from flask import json
from flaskr.models import Company


def generate_Company():
    company = Company()
    company.user_id = "hoge"
    company.id = "hoge"
    company.name = "hoge"
    company.update_date = 12345
    return company


def test_write_db(session):
    company = generate_Company()
    session.add(company)
    session.commit()
    assert company.unique_id > 0

    data = Company.query.first()
    assert data.name == "hoge"


def test_save_delete(client, session):
    TAG_ID = "XY.24tpi3E"
    # テスト用ユーザーでログイン
    client.get("/test/login")

    # Companyデータを送信
    payload = {"name": "志望動機", "id": TAG_ID, "updateDate": 1644413074333}
    data = json.dumps(payload)
    response = client.post("/company/", data=data, content_type="application/json")
    assert response.status_code == 200

    # CompanyデータがDBに保存されたことを確認
    saved_data = Company.query.first()
    assert saved_data.id == TAG_ID

    # Companyデータ削除を送信
    response = client.delete("/company/" + TAG_ID)
    assert response.status_code == 200

    # CompanyデータがDBから削除されたことを確認
    saved_data = Company.query.first()
    assert saved_data == None


def test_different_client(client, client2, session):
    client.get("/test/login")

    # Companyデータを送信(client1)
    payload = {"name": "志望動機", "id": "hoge", "updateDate": 1644413074333}
    data = json.dumps(payload)
    response = client.post("/company/", data=data, content_type="application/json")
    assert response.status_code == 200
    latest_uuid = response.get_json()["uuid"]

    client2.get("/test/login")
    # Companyデータを送信(client2)
    payload = {"name": "志望動機", "id": "hoge", "updateDate": 1644413074333}
    data = json.dumps(payload)
    response = client2.post("/company/", data=data, content_type="application/json")
    assert latest_uuid != response.get_json()["uuid"]
