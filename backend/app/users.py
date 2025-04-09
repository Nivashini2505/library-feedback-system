from flask import Blueprint, request, jsonify
from flask_cors import CORS
from datetime import datetime

# importing database collections from app
from database import users_collection

# Flask Blueprint
users_bp = Blueprint("users", __name__)
CORS(users_bp)

session = {}

@users_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")

    if not email.endswith("@psgtech.ac.in"):
        return jsonify({"error": "Only Official emails are allowed"}), 403

    uid = email.split("@")[0]
    existing_user = users_collection.find_one({'email':email, "role":"user"})
    if existing_user:
        last_feedback = existing_user.get('last_feedback')
        if last_feedback:
            day_since_feedback = (datetime.utcnow()-last_feedback).days
            if day_since_feedback < 30:
                return jsonify({
                    "error":"Feedback already submitted","message":f"Please wait {30-day_since_feedback} days before submitted new feedback"
                }), 403
        users_collection.update_one({"email":email},
                                    {"$set":{"last_login":datetime.utcnow()}})
    else:
        user_data = {
            "email":email,
            "roll_no":uid.lower(),
            "last_feedback":None,
            "last_login":datetime.utcnow()
        }
        users_collection.insert_one(user_data)

    session["email"] = email
    session['roll_no'] = uid

    return jsonify({"message": "Login successful", "email": email})




@users_bp.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    if "user" not in session:
        return jsonify({"error": "Unauthorized"}), 403

    email = session["email"]
    uid = session["roll_no"]
    feedback_data = request.json.get("answers")

    if not feedback_data or len(feedback_data) != 10:
        return jsonify({"error": "Invalid feedback format"}), 400

    users_collection.update_one(
        {"email": email},
        {"$set": {
            "last_feedback": datetime.utcnow(),
            "latest_feedback": feedback_data
        }}
    )

    return jsonify({"message": "Feedback submitted successfully"})







@users_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("email", None)
    session.pop("roll_no",None)
    return jsonify({"message": "Logged out successfully"})



# TODO: get the feedback and process it and store them in the database
# TODO: send the mail to users regarding the feedback submitssion (and issue if any)

