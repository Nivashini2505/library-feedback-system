from pymongo import MongoClient
import os
import dotenv

dotenv.load_dotenv()

# MongoDB Connection
try:
    mongo_client = MongoClient(os.getenv("MONGO_URI"))
    db = mongo_client.get_database("database")
except Exception as e:
    print(f"[-] Database conneciton error: {e}")

# Collections
users_collection = db.users
user_logs_collection = db.logs