from flask import Flask
import pytest
from flaskr import create_app, db
from sqlalchemy.orm import sessionmaker, scoped_session, Session, close_all_sessions


@pytest.fixture(scope="session")
def app():
    app = create_app(is_test=True)
    app.testing = True
    # Establish an application context before running the tests.
    ctx = app.app_context()
    ctx.push()

    yield app
    ctx.pop()


def clean_up_db():
    close_all_sessions()
    db.drop_all()
    db.create_all()


@pytest.fixture(scope="function")
def transaction(app):
    clean_up_db()
    session = Session(bind=db.engine)
    yield session


@pytest.fixture(scope="session")
def client(app):
    test_client = app.test_client()
    yield test_client
    test_client.delete()


@pytest.fixture(scope="session")
def client2(app):
    test_client = app.test_client()
    yield test_client
    test_client.delete()
