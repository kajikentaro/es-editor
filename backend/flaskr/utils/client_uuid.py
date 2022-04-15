import uuid
from uuid import uuid4

from flask_login import current_user
from flaskr import db
from flaskr.models import User


def update_uuid():
    uuid = str(uuid4())
    current_user.latest_uuid = uuid
    db.session.commit()
    return uuid


def is_same_client(current_user, uuid):
    return current_user.uuid == uuid
