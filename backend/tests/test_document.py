from flask import json
from flaskr.models import Document, DocumentHistory
from flaskr.utils.random_id import gen_random_local_id


def generate_Document():
    document = Document()
    document.user_id = "hoge"
    document.id = "hoge"
    document.historyId = "hoge"
    document.name = "hoge"
    document.company_id = "hoge"
    document.tag_id = "hoge"
    document.text = "hoge"
    document.word_count = 123
    document.update_date = 12345
    return document


def test_write_db(session):
    document = generate_Document()
    session.add(document)
    session.commit()
    assert document.unique_id > 0

    data = Document.query.first()
    assert data.name == "hoge"


def test_save_delete(client, session):
    DOCUMENT_ID = "XY.24tpi3E"
    # テスト用ユーザーでログイン
    client.get("/test/login")

    # データを送信
    payload = {
        "id": DOCUMENT_ID,
        "hidsotyId": gen_random_local_id(),
        "name": "",
        "companyId": "hoge",
        "tagId": "hoge",
        "text": "hoge",
        "wordCount": 123,
        "updateDate": 1644413074333,
    }
    data = json.dumps(payload)
    response = client.post("/document/", data=data, content_type="application/json")
    assert response.status_code == 200

    # データがDBに保存されたことを確認
    saved_data = Document.query.first()
    assert saved_data.id == DOCUMENT_ID

    # データ削除を送信
    response = client.delete("/document/" + DOCUMENT_ID)
    assert response.status_code == 200

    # データがDBから削除されたことを確認
    saved_data = Document.query.first()
    assert saved_data == None

    # 履歴に残っているか確認
    history_data = DocumentHistory.query.first()
    assert history_data.text == "hoge"


def test_save_two_times(client, session):
    DOCUMENT_ID = "XY.24tpi3E"
    # テスト用ユーザーでログイン
    client.get("/test/login")

    # データを送信
    payload = {
        "id": DOCUMENT_ID,
        "hidsotyId": gen_random_local_id(),
        "name": "",
        "companyId": "hoge",
        "tagId": "hoge",
        "text": "hoge",
        "wordCount": 123,
        "updateDate": 1000000000000,
    }
    data = json.dumps(payload)
    response = client.post("/document/", data=data, content_type="application/json")
    assert response.status_code == 200

    # データを送信
    payload = {
        "id": DOCUMENT_ID,
        "hidsotyId": gen_random_local_id(),
        "name": "",
        "companyId": "hoge2",
        "tagId": "hoge2",
        "text": "hoge2",
        "wordCount": 1234,
        "updateDate": 1000010000000,
    }
    data = json.dumps(payload)
    response = client.post("/document/", data=data, content_type="application/json")
    assert response.status_code == 200

    saved_data = Document.query.first()
    assert saved_data.text == "hoge2"

    history_data = DocumentHistory.query.filter_by(text="hoge")
    assert history_data != None
    history_data = DocumentHistory.query.filter_by(text="hoge2")
    assert history_data != None


def test_multibyte4(client, session):
    DOCUMENT_ID = "XY.24tpi3E"
    client.get("/test/login")
    payload = {
        "id": DOCUMENT_ID,
        "hidsotyId": gen_random_local_id(),
        "name": "",
        "companyId": "hoge",
        "tagId": "hoge",
        "text": "🎶",
        "wordCount": 123,
        "updateDate": 1644413074333,
    }
    data = json.dumps(payload)
    response = client.post("/document/", data=data, content_type="application/json")
    assert response.status_code == 200
    saved_data = Document.query.first()
    assert saved_data.id == DOCUMENT_ID
