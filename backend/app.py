from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from db.recording import save_recording, get_recordings, get_recording_content, delete_recording
import logging
from dotenv import load_dotenv
import io
from services.speech_to_text import scan_recording_route
from services.gpt_service import extract_task_and_datetime 
from services.events_service import get_all_events
from services.tasks_service import delete_task_by_id

load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, methods=["GET", "POST", "DELETE", "OPTIONS"])

logging.basicConfig(level=logging.DEBUG)

@app.route('/save-recording', methods=['POST'])
def save_recording_route():
    logging.debug("Received request to save recording.")
    if 'recording' not in request.files:
        logging.error("No recording file found in request.")
        return jsonify({"status": "error", "message": "No recording found."}), 400

    recording = request.files['recording']
    filename = recording.filename
    logging.debug(f"Recording filename: {filename}")

    recording_data = {
        "filename": filename,
        "content": recording.read()
    }

    try:
        recording_id = save_recording(recording_data)
        logging.debug(f"Recording saved successfully with ID: {recording_id}")
        return jsonify({"status": "success", "id": str(recording_id)})
    except Exception as e:
        logging.error(f"Error saving recording: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get-recordings', methods=['GET'])
def get_recordings_route():
    try:
        recordings = get_recordings()  
        return jsonify({"status": "success", "recordings": recordings})
    except Exception as e:
        logging.error(f"Error retrieving recordings: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/delete-recording/<recording_id>', methods=['DELETE'])
def delete_recording_route(recording_id):
    try:
        deleted = delete_recording(recording_id)
        if deleted:
            logging.debug(f"Recording with ID: {recording_id} deleted successfully.")
            return jsonify({"status": "success"}), 200
        else:
            logging.error(f"Recording with ID: {recording_id} not found.")
            return jsonify({"status": "error", "message": "Recording not found."}), 404
    except Exception as e:
        logging.error(f"Error deleting recording: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/play-recording/<recording_id>', methods=['GET'])
def play_recording_route(recording_id):
    try:
        recording_content = get_recording_content(recording_id)
        if recording_content:
            return send_file(io.BytesIO(recording_content), mimetype="audio/wav", as_attachment=False)
        else:
            logging.error(f"Recording with ID: {recording_id} not found.")
            return jsonify({"status": "error", "message": "Recording not found."}), 404
    except Exception as e:
        logging.error(f"Error playing recording: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

app.add_url_rule('/scan-recording', view_func=scan_recording_route, methods=['POST'])

@app.route('/extract-task', methods=['POST'])
def extract_task_route():
    logging.debug("Received request to extract task and datetime from transcription.")
    data = request.get_json()

    if 'transcription' not in data:
        logging.error("No transcription found in request.")
        return jsonify({"status": "error", "message": "No transcription found."}), 400

    transcription = data['transcription']

    try:
        logging.debug("Sending transcription to GPT for task and datetime extraction.")
        gpt_response = extract_task_and_datetime(transcription)
        logging.debug(f"GPT response: {gpt_response}")
        
        return jsonify({"status": "success", "gpt_response": gpt_response})
    except Exception as e:
        logging.error(f"Error extracting task and datetime: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get-events', methods=['GET'])
def get_events_route():
    """Retrieve all events and return them as JSON."""
    try:
        events = get_all_events()
        return jsonify({"status": "success", "events": events}), 200
    except Exception as e:
        logging.error(f"Error retrieving events: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/get-tasks', methods=['GET'])
def get_tasks():
    try:
        events = get_all_events()  
        return jsonify({"status": "success", "tasks": events})
    except Exception as e:
        logging.error(f"Error retrieving tasks: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/delete-task/<task_id>', methods=['DELETE'])
def delete_task_route(task_id):
    """Route to delete a task by its ID."""
    return jsonify(delete_task_by_id(task_id))

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':  
    app.run(debug=True)
