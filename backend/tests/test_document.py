from flask import json
from flaskr.models import Document


def generate_Document():
    document = Document()
    document.user_id = "hoge"
    document.id = "hoge"
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
