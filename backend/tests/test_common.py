def test_home(client):
    response = client.get("/")
    assert response.status_code == 200


def test_login(client, session):
    response = client.get("/test/login")
    assert response.status_code == 200
    response = client.get("/test/is_login")
    assert response.status_code == 200
    response = client.get("/test/is_logout")
    assert response.status_code == 400

    response = client.get("/logout", follow_redirects=True)
    assert response.status_code == 200
    response = client.get("/test/is_login")
    assert response.status_code == 400
    response = client.get("/test/is_logout")
    assert response.status_code == 200
