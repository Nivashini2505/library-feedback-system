from flask import Blueprint, request, jsonify, session
from flask_cors import CORS
import datetime

# Flask Blueprint
users_bp = Blueprint("users", __name__)
CORS(users_bp)

session = {}

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")

    if not email or not email.endswith("@psgtech.ac.in"):
        return jsonify({"error": "Only official emails are allowed"}), 403

    try:
        uid = email.split("@")[0]
        session["user"] = {"email": email, "uid": uid}

        # TODO: Check if the user has already submitted feedback in the past 30 days
        # Implement check_spam_feedback() from db_func.py, else return error message

        return jsonify({"message": "Login successful", "email": email})
    except Exception as e:
        return jsonify({"error": "Invalid credentials", "details": str(e)}), 401


@users_bp.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 403

    email = session["user"]["email"]
    uid = session["user"]["uid"]
    feedback_data = request.json.get("answers")

    if not feedback_data or len(feedback_data) != 10:
        return jsonify({"error": "Invalid feedback format"}), 400

    return jsonify({"message": "Feedback submitted successfully"})







@users_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"message": "Logged out successfully"})



@users_bp.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "API is working!"})
