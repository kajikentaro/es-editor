import pytest
from flask import json
from flaskr.models import DocumentSchema, Tag


def test_db(session):
    tag = Tag()
    tag.user_id = 'hoge'
    tag.id = 'hoge'
    tag.name = 'hoge'
    tag.update_date = 12345

    session.add(tag)
    session.commit()

    assert tag.unique_id > 0


def test_home(client):
    response = client.get('/')
    assert response.status_code == 200


def test_template(client, client2):
    response = client.get(
        '/',
        data=json.dumps({'a': 1, 'b': 2}),
        content_type='application/json',
    )
    # assert (response.get_data(as_text=True)) == None
    # data = json.loads(response.get_data(as_text=True))
    assert response.status_code == 200

    # assert data['sum'] == 3
