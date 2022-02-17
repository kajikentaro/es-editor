from flask import json

from .. import create_app

app = create_app()


def get_list():
    response = app.test_client().get(
        '/document',
        #data=json.dumps({'a': 1, 'b': 2}),
        content_type='application/json',
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    #assert data['sum'] == 3
