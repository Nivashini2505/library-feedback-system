from flask import Blueprint, request, jsonify, redirect, session, url_for
import hashlib
import requests
import datetime
from flask_cors import CORS

# importing database collections from app
from database import users_collection

# Flask Blueprint
admin_bp = Blueprint("admin", __name__)
CORS(admin_bp)

session = {}


@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Validate input
    if not username or not password:
        return jsonify({
            "error": "Email and password are required"
        }), 400

    # Hash the password before comparing
    # hashed_password = hashlib.sha256(password.encode()).hexdigest()

    # Check if admin exists and credentials are correct
    existing_admin = users_collection.find_one({
        'username': username,
        'role': 'admin',
        'password': password
    })

    if not existing_admin:
        return jsonify({
            "error": "Invalid credentials or admin account does not exist"
        }), 401

    users_collection.update_one(
        {"username":username.lower()},
        {"$set": {
            'last_login':datetime.datetime.utcnow()
        }}
    )

    # Set session data
    session["username"] = username
    session["role"] = "admin"
    session["admin_id"] = str(existing_admin.get('_id'))

    return jsonify({"message": "Login successful","email": username})








@admin_bp.route("/check_session", methods=["GET"])
def check_session():
    if "username" in session:
        return jsonify({"logged_in": True, "username": session["username"]})
    else:
        return jsonify({"logged_in": False}), 401


@admin_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)
    session.pop("role", None)
    session.pop("admin_id", None)
    return jsonify({"message": "Logged out successfully"})


@admin_bp.route("/test/<name>", methods=["GET"])
def test(name):
    return jsonify({"message": f"Hello {name}"})



