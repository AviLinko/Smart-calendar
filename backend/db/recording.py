from db.mongo_connection import get_db
from bson import ObjectId

def save_recording(recording_data):
    db = get_db()
    recordings_collection = db["recordings"]
    result = recordings_collection.insert_one(recording_data)
    return result.inserted_id

def get_recordings():
    db = get_db()
    recordings_collection = db["recordings"]
    recordings = recordings_collection.find({}, {"_id": 1, "filename": 1})

    recordings_list = []
    for recording in recordings:
        recording["_id"] = str(recording["_id"])  
        recordings_list.append(recording)

    return recordings_list

def get_recording_content(recording_id):
    db = get_db()
    recordings_collection = db["recordings"]
    recording = recordings_collection.find_one({"_id": ObjectId(recording_id)})
    
   
    return recording['content'] if recording else None

def delete_recording(recording_id):
    db = get_db()
    recordings_collection = db["recordings"]
    result = recordings_collection.delete_one({"_id": ObjectId(recording_id)})
    
   
    return result.deleted_count > 0
