import pytest
from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config.update(TESTING=True)
    with app.test_client() as client:
        yield client


def test_index(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert "message" in resp.get_json()


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ok"


def test_sum(client):
    resp = client.get("/sum/2/3")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["result"] == 5
