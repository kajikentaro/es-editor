import pytest
from flask import json
from flaskr.models import Document, DocumentSchema


def test_db(db_session):
    document = Document()
    document.id = 'hoge'
    document.name = 'hoge'
    document.company_id = 'hoge'
    document.tag_id = 'hoge'
    document.text = 'hoge'
    document.word_count = 'hoge'
    document.update_date = 123
    document.user_id = 'hoge'

    db_session.add(document)
    db_session.commit()

    stored_document = Document.query.filter_by(
        user_id=document.user_id, id=document.id).one_or_none()
    assert stored_document != None
