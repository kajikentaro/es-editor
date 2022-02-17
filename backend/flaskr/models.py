from flask_login import UserMixin
from sqlalchemy import BigInteger, Column, Integer, String

from . import db, ma


def local_id(): return String(20)
def global_id(): return String(30)
def content_title(): return String(150)


class User(UserMixin, db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(global_id(), unique=True)
    user_name = Column(content_title())
    email = Column(String(150))

    def __init__(self, user_id, user_name, email):
        self.user_id = user_id
        self.user_name = user_name
        self.email = email


class Tag(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    name = Column(content_title())
    update_date = Column(BigInteger)


class Company(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    name = Column(content_title())
    update_date = Column(BigInteger)


class Document(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    name = Column(String(150))
    company_id = Column(local_id())
    tag_id = Column(local_id())
    text = Column(String(10000))
    word_count = Column(Integer)
    update_date = Column(BigInteger)


class DocumentHistory(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(global_id())
    documentId = Column(local_id())
    name = Column(String(150))
    company_id = Column(local_id())
    tag_id = Column(local_id())
    text = Column(String(10000))
    word_count = Column(Integer)
    update_date = Column(BigInteger)


class DeletedDocument(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    update_date = Column(BigInteger)


class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
