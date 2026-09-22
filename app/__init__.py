from flask import Flask, jsonify


def create_app():
    app = Flask(__name__)

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
