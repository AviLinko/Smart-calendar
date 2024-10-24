from pymongo import MongoClient
from dotenv import load_dotenv
import os
import logging
from datetime import datetime

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["smart_reminder_db"]
events_collection = db["events"]

def format_date(gpt_date):
    """Convert date from DD/MM/YYYY to YYYY-MM-DD"""
    try:
        return datetime.strptime(gpt_date, "%d/%m/%Y").strftime("%Y-%m-%d")
    except ValueError as e:
        logging.error(f"Error formatting date: {str(e)}")
        return None

def format_time(gpt_time):
    """Ensure time is in HH:MM format."""
    if len(gpt_time) == 2:  
        return f"{gpt_time}:00"
    return gpt_time

def save_event(event_name, date, time, description, user_id="default_user"):
    """Save an event in the events collection with ISODate format."""
    try:
        # Format the date from GPT to match YYYY-MM-DD and combine with time
        formatted_date = format_date(date)
        formatted_time = format_time(time)
        
        if formatted_date is None or formatted_time is None:
            return None

        # Combine the formatted date and time into a single datetime object
        event_datetime = datetime.strptime(f"{formatted_date} {formatted_time}", "%Y-%m-%d %H:%M")

        new_event = {
            "event_name": event_name,
            "date": event_datetime,  
            "description": description,
            "user_id": user_id
        }
        
        result = events_collection.insert_one(new_event)
        logging.debug(f"Event saved with ID: {result.inserted_id}")
        return result.inserted_id
    except Exception as e:
        logging.error(f"Error saving event: {str(e)}")
        return None

def get_all_events():
    """Retrieve all events from the events collection and convert ObjectId to string."""
    try:
        events = list(events_collection.find({}))
    
        # Convert ObjectId to string for JSON serialization
        for event in events:
            event['_id'] = str(event['_id'])
        
        return events
    except Exception as e:
        logging.error(f"Error retrieving events: {str(e)}")
        return []

def delete_event_by_id(event_id):
    """Delete an event by its ID."""
    from bson.objectid import ObjectId
    try:
        result = events_collection.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count > 0:
            logging.debug(f"Event with ID {event_id} deleted successfully.")
            return True
        else:
            logging.warning(f"No event found with ID {event_id}.")
            return False
    except Exception as e:
        logging.error(f"Error deleting event: {str(e)}")
        return False

    return events
