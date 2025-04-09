from flask import Blueprint, request, jsonify, redirect, session, url_for
import hashlib
import requests
import datetime
from flask_cors import CORS

# importing database collections from app
from database import users_collection
from database import user_logs_collection

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


@admin_bp.route("/login_count", methods=["GET"])
def login_count():
    time_period = request.args.get("period")  # Expected values: "weekly", "monthly"

    if time_period not in ["weekly", "monthly"]:
        return jsonify({"error": "Invalid time period. Use 'weekly' or 'monthly'."}), 400

    now = datetime.datetime.utcnow()
    start_date = None

    if time_period == "weekly":
        start_date = now - datetime.timedelta(days=7)  # Get data for the last 7 days
    elif time_period == "monthly":
        start_date = now - datetime.timedelta(days=365)  # Get data for the last 12 months

    # Prepare the response
    result = []

    if time_period == "weekly":
        # Group by day
        login_counts = user_logs_collection.aggregate([
            {"$match": {"date": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "day": {"$dayOfYear": "$date"},
                        "year": {"$year": "$date"}
                    },
                    "login_count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}  # Sort by day and year
            }
        ])
        
        # Prepare the response for daily data
        for day in range(7):  # Last 7 days
            day_date = now - datetime.timedelta(days=day)
            count = next((entry["login_count"] for entry in login_counts if entry["_id"]["day"] == day_date.timetuple().tm_yday and entry["_id"]["year"] == day_date.year), 0)
            result.append({"period": day_date.strftime("%Y-%m-%d"), "login_count": count})

    else:  # Monthly
        # Group by week
        login_counts = user_logs_collection.aggregate([
            {"$match": {"date": {"$gte": start_date}}},
            {
                "$group": {
                    "_id": {
                        "week": {"$week": "$date"},
                        "year": {"$year": "$date"}
                    },
                    "login_count": {"$sum": 1}
                }
            },
            {
                "$sort": {"_id": 1}  # Sort by week and year
            }
        ])
        
        # Prepare the response for weekly data
        for week in range(1, 9):  # Last 8 weeks
            week_date = now - datetime.timedelta(weeks=week)
            count = next((entry["login_count"] for entry in login_counts if entry["_id"]["week"] == week_date.isocalendar()[1] and entry["_id"]["year"] == week_date.year), 0)
            result.append({"period": f"Week {week}", "login_count": count})

    return jsonify(result), 200


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



