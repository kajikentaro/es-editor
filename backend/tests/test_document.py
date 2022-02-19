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

    print(tag.unique_id)
    assert tag.unique_id > 0
