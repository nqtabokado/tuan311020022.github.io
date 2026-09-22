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


def test_cors_header(client):
    """Client Vue chạy ở origin khác, nên API phải trả header CORS."""
    resp = client.get("/health", headers={"Origin": "http://localhost:8080"})
    assert resp.status_code == 200
    assert resp.headers.get("Access-Control-Allow-Origin") is not None
