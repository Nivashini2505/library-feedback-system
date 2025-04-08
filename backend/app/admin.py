from flask import Blueprint, request, jsonify, redirect, session, url_for
import hashlib
import requests
import datetime
from flask_cors import CORS

# Flask Blueprint
admin_bp = Blueprint("admin", __name__)
CORS(admin_bp)

session = {}


@admin_bp.route("/test/<name>", methods=["GET"])
def test(name):
    return jsonify({"message": f"Hello {name}"})












@admin_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out successfully"})