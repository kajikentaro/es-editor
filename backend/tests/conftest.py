import os

import pytest
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flaskr import create_app

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path, verbose=True)


@pytest.fixture(scope='session')
def app():
    '''
    Create a Flask app context for the tests.
    '''
    app = create_app()

    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://{user}:{password}@{host}/{db_name}".format(**{
        'user': os.environ.get('RDS_USER', None),
        'password': os.environ.get('RDS_PASS', None),
        'host': os.environ.get('RDS_HOST', None),
        'db_name': os.environ.get('RDS_DB_NAME', None)
    })

    return app


@pytest.fixture(scope='session')
def _db(app):
    '''
    Provide the transactional fixtures with access to the database via a Flask-SQLAlchemy
    database connection.
    '''
    db = SQLAlchemy(app=app)

    return db
