# utils/db.py

import os
from typing import List, Dict
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")  # From .env (Cloud URI)
client = MongoClient(MONGO_URI)

db = client["swift_rules"]
collection = db["mt_cache"]

