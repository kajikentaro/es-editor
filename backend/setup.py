from flaskr import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(ssl_context="adhoc", host="0.0.0.0")
