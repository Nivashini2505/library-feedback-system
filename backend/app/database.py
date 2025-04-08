from pymongo import MongoClient
import os
import dotenv

dotenv.load_dotenv()

# MongoDB Connection
mongo_client = MongoClient(os.getenv("MONGO_URI"))
db = mongo_client.get_database("database")

# Collections
users_collection = db.users