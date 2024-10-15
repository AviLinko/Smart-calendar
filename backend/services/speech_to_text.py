from flask import request, jsonify
from google.cloud import speech
import logging

def scan_recording_route():
    logging.debug("Received request to scan recording.")
    if 'recording' not in request.files:
        logging.error("No recording file found in request.")
        return jsonify({"status": "error", "message": "No recording found."}), 400

    recording = request.files['recording']
    audio_content = recording.read()

    
    with open("recording.wav", "wb") as f:
        f.write(audio_content)

    try:
        client = speech.SpeechClient()

        
        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            language_code="he-IL" 
        )

       
        response = client.recognize(config=config, audio=audio)

        transcript = ""
        for result in response.results:
            transcript += result.alternatives[0].transcript

        logging.debug(f"Transcription result: {transcript}")
        return jsonify({"transcription": transcript}), 200

    except Exception as e:
        logging.error(f"Error transcribing audio: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500
