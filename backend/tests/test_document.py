import pytest
from flask import json
from flaskr.models import Document, DocumentSchema

from . import client, database


def test_home(client):
    response = client.get('/')
    assert response.status_code == 200


def test_db(database):
    document = Document()
    document.id = 'hoge'
    document.name = 'hoge'
    document.company_id = 'hoge'
    document.tag_id = 'hoge'
    document.text = 'hoge'
    document.word_count = 'hoge'
    document.update_date = 123
    document.user_id = 'hoge'

    database.session.add(document)
    database.session.commit()

    stored_document = Document.query.filter_by(
        user_id=document.user_id, id=document.id).one_or_none()
    assert stored_document != None


def test_template(client):
    response = client.get(
        '/',
        data=json.dumps({'a': 1, 'b': 2}),
        content_type='application/json',
    )

    #assert (response.get_data(as_text=True)) == None
    #data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    #assert data['sum'] == 3
