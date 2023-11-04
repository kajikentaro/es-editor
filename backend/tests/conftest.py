from flask_sqlalchemy import SQLAlchemy
import pytest
from flaskr import create_app
from flaskr import db as _db


@pytest.fixture(scope="session")
def app(request):
    app = create_app(is_test=True)
    app.testing = True

    # Establish an application context before running the tests.
    ctx = app.app_context()
    ctx.push()

    def teardown():
        ctx.pop()

    request.addfinalizer(teardown)
    return app


@pytest.fixture(scope="function")
def db(app, request):
    def teardown():
        _db.drop_all()
        _db.create_all()

    request.addfinalizer(teardown)
    return _db


@pytest.fixture(scope="function")
def session(db: SQLAlchemy, request):
    """Creates a new database session for a test."""
    def teardown():
        db.session.rollback()
        db.session.close()
        db.session.remove()

    request.addfinalizer(teardown)
    return db.session


# https://github.com/pytest-dev/pytest-flask/issues/70
# http://alexmic.net/flask-sqlalchemy-pytest/


@pytest.fixture
def client(app):
    test_client = app.test_client()
    yield test_client
    test_client.delete()


@pytest.fixture
def client2(app):
    test_client = app.test_client()
    yield test_client
    test_client.delete()
