import os
from dotenv import load_dotenv
from flask import Flask, render_template, redirect, Response
from flask_login import LoginManager, login_required, UserMixin, login_user, logout_user
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from flask_sqlalchemy import SQLAlchemy

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path, verbose=True)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://{user}:{password}@{host}/{db_name}".format(**{
  'user': os.environ.get('RDS_USER', None),
  'password': os.environ.get('RDS_PASS', None),
  'host': os.environ.get('RDS_HOST', None),
  'db_name': os.environ.get('RDS_DB_NAME', None)
})
app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY") or os.urandom(24)
db = SQLAlchemy(app)


login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin, db.Model):
    __tablename__ = 'User'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text())
    mail = db.Column(db.Text())
    def __init__(self, name, mail):
      self.name = name
      self.mail = mail

#db.create_all()

class LoginForm(FlaskForm):
  name = StringField('名前')
  mail = StringField('メールアドレス')
  submit = SubmitField('ログイン')


@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))


@app.route('/')
def index():
  return Response("Hello World!")

@app.route('/member')
@login_required
def member():
  return render_template('member.html')

@app.route('/login', methods=['GET','POST'])
def login():
  form = LoginForm()
  if form.validate_on_submit():
    if User.query.filter_by(name=form.name.data, mail=form.mail.data).one_or_none():
      user = User.query.filter_by(name=form.name.data).one_or_none()
      login_user(user)
      return redirect('/member')
    else:
      return Response('ログインに失敗しました')
  return Response('''
        <form action="" method="post">
            <p><input type=text name=username>
            <p><input type=password name=password>
            <p><input type=submit value=Login>
        </form>
        ''')

@app.route('/logout')
def logout():
  logout_user()
  return render_template('logout.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
