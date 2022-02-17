import os

import pytest
from dotenv import load_dotenv
from flask import json
from flask_sqlalchemy import SQLAlchemy
from flaskr import create_app, db

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')

load_dotenv(dotenv_path, verbose=True)

app = create_app()


@pytest.fixture
def client():
    app.config['TESTING'] = True
    test_client = app.test_client()
    yield test_client
    test_client.delete()


@pytest.fixture
def database():
    # db.drop_all()
    with app.app_context():
        db.create_all()
    yield db
