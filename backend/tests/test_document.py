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

    stored_document = Tag.query.filter_by(
        user_id=tag.user_id, id=tag.id).one_or_none()
    assert stored_document != None
