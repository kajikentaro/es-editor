def test_home(client):
    response = client.get("/")
    assert response.status_code == 200


def test_login(client, session):
    response = client.get("/test/login")
    assert response.status_code == 200
    response = client.get("/test/is_login")
    assert response.get_json()["is_login"] == True

    response = client.get("/logout")
    response = client.get("/test/is_login")
    assert response.get_json()["is_login"] == False
