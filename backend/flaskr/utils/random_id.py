import secrets


def gen_random_local_id():
    return secrets.token_urlsafe(15)
