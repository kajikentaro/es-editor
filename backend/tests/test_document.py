import pytest
from flask import json
from flaskr.models import Document, DocumentSchema


def test_db(session):
    document = Document()
    document.id = 'hoge'
    document.name = 'hoge'
    document.company_id = 'hoge'
    document.tag_id = 'hoge'
    document.text = 'hoge'
    document.word_count = 1
    document.update_date = 123
    document.user_id = 'hoge'

    session.add(document)
    session.commit()

    stored_document = Document.query.filter_by(
        user_id=document.user_id, id=document.id).one_or_none()
    assert stored_document != None
