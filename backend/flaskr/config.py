import os

from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path, verbose=True)

SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{user}:{password}@{host}/{db_name}".format(**{
    'user': os.environ.get('RDS_USER', None),
    'password': os.environ.get('RDS_PASS', None),
    'host': os.environ.get('RDS_HOST', None),
    'db_name': os.environ.get('RDS_DB_NAME', None)
})

SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.environ.get("SECRET_KEY") or os.urandom(24)
