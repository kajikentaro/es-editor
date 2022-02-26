import uuid
from uuid import uuid4

from flask_login import current_user
from flaskr.models import User


def save_uuid(current_user, db):
    uuid = str(uuid4())
    current_user.latest_uuid = uuid4
    return uuid


def is_same_client(current_user, uuid):
    return current_user.uuid == uuid
