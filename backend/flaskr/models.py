from abc import ABCMeta, abstractmethod
from datetime import datetime, timedelta

from flask_login import UserMixin
from sqlalchemy import BigInteger, Column, Integer, String

from flaskr.utils.random_id import gen_random_local_id

from . import db, ma


def local_id():
    return String(20)


def global_id():
    return String(30)


def content_title():
    return String(150)


def uuid():
    return String(40)


class User(UserMixin, db.Model):
    id = Column(Integer, primary_key=True)
    user_id = Column(global_id(), unique=True)
    user_name = Column(content_title())
    email = Column(String(150))
    latest_uuid = Column(uuid())

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

    # TODO: 共通化する
    # update_dateが新しい場合のみ更新する
    def init_from_dict(self, dict, user_id):
        if (dict.get("updateDate") and self.update_date) and (
            dict.get("updateDate") <= self.update_date
        ):
            return False
        self.update_date = dict.get("updateDate")
        self.user_id = user_id
        self.id = dict.get("id")
        self.name = dict.get("name")
        return True


class Company(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    name = Column(content_title())
    update_date = Column(BigInteger)

    # TODO: 共通化する
    # update_dateが新しい場合のみ更新する
    def init_from_dict(self, dict, user_id):
        if (dict.get("updateDate") and self.update_date) and (
            dict.get("updateDate") <= self.update_date
        ):
            return False
        self.update_date = dict.get("updateDate")
        self.user_id = user_id
        self.id = dict.get("id")
        self.name = dict.get("name")
        return True


class Document(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    name = Column(String(150))
    company_id = Column(local_id())
    tag_id = Column(local_id())
    text = Column(String(10000))
    word_count = Column(Integer)
    update_date = Column(BigInteger, nullable=False)

    # TODO: 共通化する
    # update_dateが新しい場合のみ更新する
    def init_from_dict(self, dict, user_id):
        if (dict.get("updateDate") and self.update_date) and (
            dict.get("updateDate") <= self.update_date
        ):
            return False
        self.update_date = dict.get("updateDate")
        self.user_id = user_id
        self.id = dict.get("id")
        self.name = dict.get("name")
        self.company_id = dict.get("companyId")
        self.tag_id = dict.get("tagId")
        self.text = dict.get("text")
        self.word_count = dict.get("wordCount")
        self.update_date = dict.get("updateDate")
        return True


class DocumentHistory(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(global_id())
    document_id = Column(local_id())
    name = Column(String(150))
    company_id = Column(local_id())
    tag_id = Column(local_id())
    text = Column(String(10000))
    word_count = Column(Integer)
    update_date = Column(BigInteger)

    # TODO: 共通化する
    # update_dateが新しい場合のみ更新する
    def init_from_dict(self, dict, user_id):
        if (dict.get("updateDate") and self.update_date) and (
            dict.get("updateDate") <= self.update_date
        ):
            return False
        self.update_date = dict.get("updateDate")
        self.user_id = user_id
        self.id = dict.get("id")
        self.name = dict.get("name")
        self.company_id = dict.get("companyId")
        self.tag_id = dict.get("tagId")
        self.document_id = dict.get("documentId")
        self.text = dict.get("text")
        self.word_count = dict.get("wordCount")
        return True

    def init_from_document(self, document):
        self.user_id = document.user_id
        self.id = gen_random_local_id()
        self.document_id = document.id
        self.name = document.name
        self.company_id = document.company_id
        self.tag_id = document.tag_id
        self.text = document.text
        self.word_count = document.word_count
        self.update_date = document.update_date


class DeletedHistory(db.Model):
    unique_id = Column(Integer, autoincrement=True, primary_key=True)
    user_id = Column(global_id())
    id = Column(local_id())
    update_date = Column(BigInteger)


class DocumentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Document
