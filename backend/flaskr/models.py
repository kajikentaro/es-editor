from flask_login import UserMixin
from sqlalchemy import BigInteger, Column, Integer, String

from . import db

localId = String(20)
globalId = String(30)
contentTitle = String(150)


class User(UserMixin, db.Model):
    id = Column(Integer, primary_key=True)
    userid = Column(globalId, unique=True)
    username = Column(contentTitle)
    email = Column(String(150))

    def __init__(self, userid, username, email):
        self.userid = userid
        self.username = username
        self.email = email


class Tag(db.Model):
    uniqueid = Column(Integer, autoincrement=True, primary_key=True)
    userid = Column(globalId)
    id = Column(localId)
    name = Column(contentTitle)
    updateDate = Column(BigInteger)


class Company(db.Model):
    uniqueid = Column(Integer, autoincrement=True, primary_key=True)
    userid = Column(globalId)
    id = Column(localId)
    name = Column(contentTitle)
    updateDate = Column(BigInteger)


class Document(db.Model):
    uniqueid = Column(Integer, autoincrement=True, primary_key=True)
    userid = Column(globalId)
    id = Column(localId)
    name = Column(String(150))
    companyId = Column(localId)
    tagId = Column(localId)
    text = Column(String(10000))
    wordCount = Column(Integer)
    updateDate = Column(BigInteger)


class DocumentHistory(db.Model):
    uniqueid = Column(Integer, autoincrement=True, primary_key=True)
    userid = Column(globalId)
    id = Column(globalId)
    documentId = Column(localId)
    name = Column(String(150))
    companyId = Column(localId)
    tagId = Column(localId)
    text = Column(String(10000))
    wordCount = Column(Integer)
    updateDate = Column(BigInteger)
