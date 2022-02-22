import uuid


def save_uuid(user_id):
    id = str(uuid.uuid4())
    # TODO: save
    # return id


def is_same_client(user_id, uid):
    # fetched_uid=select uid from User where user_id=User.user_id
    # return uid==fetch_uid
