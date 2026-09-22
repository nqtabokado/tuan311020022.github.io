from flask import Flask, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    # Cho phép client Vue (chạy ở cổng khác, vd 8080) gọi API này.
    # Trình duyệt chặn request cross-origin nếu server không trả header CORS.
    CORS(app)

    @app.route("/")
    def index():
        return jsonify(message="Xin chào! Đây là app Flask demo CI/CD.")

    @app.route("/health")
    def health():
        return jsonify(status="ok")

    @app.route("/sum/<int:a>/<int:b>")
    def sum_two_numbers(a, b):
        return jsonify(a=a, b=b, result=a + b)

    return app
