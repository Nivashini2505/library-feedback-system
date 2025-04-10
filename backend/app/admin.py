from flask import Blueprint, request, jsonify, redirect, session, url_for
import hashlib
import requests
import datetime
from flask_cors import CORS

# importing database collections from app
from database import users_collection
from database import user_logs_collection
from database import feedback_collection
from database import questions_collection

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


@admin_bp.route("/combined_count", methods=["GET"])
def combined_count():
    days = int(request.args.get("days", 1))  # Get the integer value for the number of days

    if days < 1:
        return jsonify({"error": "Days must be a positive integer."}), 400

    now = datetime.datetime.utcnow()
    start_date = now - datetime.timedelta(days=days)  # Get data for the last 'days' days

    # Get login count
    login_counts = user_logs_collection.aggregate([
        {"$match": {"date": {"$gte": start_date}}},
        {
            "$group": {
                "_id": None,
                "login_count": {"$sum": 1}
            }
        }
    ])
    login_count = next(login_counts, {}).get("login_count", 0)

    # Get feedback count
    feedback_counts = feedback_collection.aggregate([
        {"$match": {"date": {"$gte": start_date}}},
        {
            "$group": {
                "_id": None,
                "feedback_count": {"$sum": 1}
            }
        }
    ])
    feedback_count = next(feedback_counts, {}).get("feedback_count", 0)

    return jsonify({
        "login_count": login_count,
        "feedback_count": feedback_count
    }), 200


























@admin_bp.route("/get_feedback_questions", methods=["GET"])
def get_feedback_questions():
    questions = questions_collection.find({}, {"_id": 1, "question": 1, "options": 1})
    feedback_questions = []
    for question in questions:
        print(question)
        # Check if the required keys exist
        if "question" in question and "options" in question:
            feedback_questions.append({
                "id": str(question["_id"]),
                "question": question["question"],
                "options": question["options"]
            })
        else:
            # Log or handle the case where the expected keys are missing
            print(f"Missing keys in question document: {question}")

    return jsonify(feedback_questions), 200

@admin_bp.route("/add_feedback_questions", methods=["POST"])
def add_feedback_questions():
    data = request.json
    question = data.get("question")
    options = data.get("options")  # Expecting an array of options

    if not question or not options or len(options) != 5:
        return jsonify({"error": "Question and exactly 5 options are required."}), 400

    questions_collection.insert_one({
        "question": question,
        "options": options
    })

    return jsonify({"message": "Feedback question added successfully."}), 201

@admin_bp.route("/delete_feedback_question/<question_id>", methods=["DELETE"])
def delete_feedback_question(question_id):
    result = questions_collection.delete_one({"_id": question_id})

    if result.deleted_count == 0:
        return jsonify({"error": "Question not found."}), 404

    return jsonify({"message": "Feedback question deleted successfully."}), 200







@admin_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("username", None)
    session.pop("role", None)
    session.pop("admin_id", None)
    return jsonify({"message": "Logged out successfully"})


@admin_bp.route("/test/<name>", methods=["GET"])
def test(name):
    return jsonify({"message": f"Hello {name}"})



