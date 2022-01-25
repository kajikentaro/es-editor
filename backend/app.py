# Python標準ライブラリ
import json
import os
import sqlite3

# サードパーティライブラリ
from flask import Flask, redirect, request, url_for
from flask_login import (
    LoginManager,
    login_required,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import requests


# 設定情報
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_CLIENT_ID = ""
GOOGLE_CLIENT_SECRET = ""
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)

# Flaskセットアップ
app = Flask(__name__)
# セッション情報を暗号化するためのキーを設定
app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

# ユーザセッション管理の設定
# https://flask-login.readthedocs.io/en/latest
login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.unauthorized_handler
def unauthorized():
    return "You must be logged in to access this content.", 403


# OAuth2クライアント設定
client = WebApplicationClient(GOOGLE_CLIENT_ID)


@app.route("/")
def index():
    return "/"


@app.route("/login")
def login():
    # 認証用のエンドポイントを取得する
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # ユーザプロファイルを取得するログイン要求
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=request.base_url + "/callback",
        scope=["openid", "email", "profile"],
    )
    print("aaa")
    return redirect(request_uri)


@app.route("/login/callback")
def callback():
    # Googleから返却された認証コードを取得する
    code = request.args.get("code")

    # トークンを取得するためのURLを取得する
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # トークンを取得するための情報を生成し、送信する
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

    # トークンをparse
    client.parse_request_body_response(json.dumps(token_response.json()))

    # トークンができたので、GoogleからURLを見つけてヒットした、
    # Googleプロフィール画像やメールなどのユーザーのプロフィール情報を取得
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # メールが検証されていれば、名前、email、プロフィール画像を取得します
    if userinfo_response.json().get("email_verified"):
        unique_id = userinfo_response.json()["sub"]
        users_email = userinfo_response.json()["email"]
        picture = userinfo_response.json()["picture"]
        users_name = userinfo_response.json()["given_name"]
    else:
        return "User email not available or not verified by Google.", 400

    # ログインしてユーザーセッションを開始
    # login_user(user)

    # フロントエンドのリダイレクト先指定
    return redirect("http://127.0.0.1:3000/list")


# @login_requiredデコレータは認証したいページに付ける
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


def get_google_provider_cfg():
    return requests.get(GOOGLE_DISCOVERY_URL).json()


if __name__ == "__main__":
    app.run(ssl_context="adhoc")
