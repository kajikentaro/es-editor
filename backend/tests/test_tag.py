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
