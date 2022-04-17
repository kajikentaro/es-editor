import json
import os

import requests
from flask import Blueprint, Response, jsonify, redirect, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from oauthlib.oauth2 import WebApplicationClient

from . import db, login_manager
from .models import (Company, CompanySchema, DeletedHistory,
                     DeletedHistorySchema, Document, DocumentHistory,
                     DocumentHistorySchema, DocumentSchema, Tag, TagSchema,
                     User)

bp = Blueprint("auth", __name__)

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = os.environ.get("GOOGLE_DISCOVERY_URL", None)

URL_AFTER_LOGIN = os.environ.get("URL_AFTER_LOGIN", None)
URL_AFTER_LOGOUT = os.environ.get("URL_AFTER_LOGOUT", None)
URL_LOGIN_CALLBACK = os.environ.get("URL_LOGIN_CALLBACK", None)

client = WebApplicationClient(GOOGLE_CLIENT_ID)


@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "You must be logged in to access this content."}), 403


@bp.route("/")
def index():
    return Response("こんにちは")


@bp.route("/login")
def login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=URL_LOGIN_CALLBACK,
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
        redirect_url=URL_LOGIN_CALLBACK,
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
        user_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    user = User.query.filter_by(user_id=user_id).one_or_none()
    if user:
        login_user(user, remember=True)
        # ログインしました
        return redirect(URL_AFTER_LOGIN)

    user = User(user_id, users_name, users_email)
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    # アカウントを作成しました
    return redirect(URL_AFTER_LOGIN)


@bp.route("/logout")
@login_required
def logout():
    logout_user()
    # return redirect(url_for("auth.index"))
    return redirect(URL_AFTER_LOGOUT)


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()
