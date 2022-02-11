from flask import Blueprint

from . import db

bp = Blueprint('auth', __name__)


@bp.route('/login')
def login():
    return 'Login'


@bp.route('/signup')
def signup():
    return 'Signup'


@bp.route('/logout')
def logout():
    return 'Logout'
