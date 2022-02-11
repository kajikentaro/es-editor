import json
import os
from enum import unique

import requests
from dotenv import load_dotenv
from flask import Blueprint, Flask, Response, redirect, request, url_for
from flask_login import (LoginManager, UserMixin, current_user, login_required,
                         login_user, logout_user)
from flask_sqlalchemy import SQLAlchemy
from oauthlib.oauth2 import WebApplicationClient

from . import db, login_manager
from .models import User

bp = Blueprint('auth', __name__)
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path, verbose=True)

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)


@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


@login_manager.unauthorized_handler
def unauthorized():
    return "You must be logged in to access this content.", 403


client = WebApplicationClient(GOOGLE_CLIENT_ID)


@bp.route("/")
def index():
    return "/"


@bp.route("/check")
def check():
    if current_user.is_authenticated:
        return Response("ログイン中")
    return Response("ログアウト中")


@bp.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


@bp.route("/login/callback")
def callback():
    code = request.args.get("code")

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    user = User.query.filter_by(unique_id=unique_id).one_or_none()
    if user:
        login_user(user)
        return Response("ログインしました")

    user = User(unique_id, users_name, users_email)
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return Response("アカウントを作成しました")


# @login_requiredデコレータは認証したいページに付ける
@bp.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()
