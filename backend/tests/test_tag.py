from flask import json
from flask_login import current_user, login_user
from flaskr.models import Tag


def generate_Tag():
    tag = Tag()
    tag.user_id = "hoge"
    tag.id = "hoge"
    tag.name = "hoge"
    tag.update_date = 12345
    return tag


def test_write_db(session):
    tag = generate_Tag()
    session.add(tag)
    session.commit()
    assert tag.unique_id > 0

    data = Tag.query.first()
    assert data.name == "hoge"


def test_save_delete(client, session):
    TAG_ID = "XY.24tpi3E"
    # テスト用ユーザーでログイン
    client.get("/test/login")

    # Tagデータを送信
    payload = {"name": "志望動機", "id": TAG_ID, "updateDate": 1644413074333}
    data = json.dumps(payload)
    response = client.post("/tag/", data=data, content_type="application/json")
    assert response.status_code == 200

    # TagデータがDBに保存されたことを確認
    saved_data = Tag.query.first()
    assert saved_data.id == TAG_ID

    # Tagデータ削除を送信
    response = client.delete("/tag/" + TAG_ID)
    assert response.status_code == 200

    # TagデータがDBから削除されたことを確認
    saved_data = Tag.query.first()
    assert saved_data == None


def test_template(client):
    response = client.get(
        "/",
        data=json.dumps({"a": 1, "b": 2}),
        content_type="application/json",
    )

    # assert (response.get_data(as_text=True)) == None
    # data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    # assert data['sum'] == 3
