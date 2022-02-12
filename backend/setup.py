from imp import reload

from flaskr import create_app

if __name__ == "__main__":
    app = create_app()
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(ssl_context="adhoc", host="0.0.0.0", debug=True)
