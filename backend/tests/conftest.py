import os

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


@pytest.fixture(scope="session")
def db(app, request):
    def teardown():
        _db.drop_all()

    _db.init_app(app)
    _db.create_all()

    request.addfinalizer(teardown)
    return _db


@pytest.fixture(scope="function")
def session(db, request):
    """Creates a new database session for a test."""
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session = db.create_scoped_session(options=options)

    db.session = session

    def teardown():
        transaction.rollback()
        connection.close()
        session.remove()

    request.addfinalizer(teardown)
    return session


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
