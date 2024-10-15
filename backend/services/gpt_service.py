import openai
import logging
from dotenv import load_dotenv
import os
from services.events_service import save_event  

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_task_and_datetime(transcription):
    logging.debug("Starting GPT-3.5 Turbo API request to extract task and datetime.")
    
    prompt = f"""
    Analyze the following transcription and extract relevant information:
    "{transcription}"

    Please extract the task, date, and time in the following format:
    - Task: <description of task>
    - Date: <day/month/year>
    - Time: <hour:minute in 24-hour format>

    If no task, date, or time is mentioned, return an empty value for each field.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  
            messages=[
                {"role": "system", "content": "You are an assistant that extracts tasks, dates, and times."},
                {"role": "user", "content": prompt}
            ]
        )

       
        extracted_info = response['choices'][0]['message']['content'].strip()
        logging.debug(f"GPT-3.5 Turbo response: {extracted_info}")
        
        task = None
        date = None
        time = None

        lines = extracted_info.split('\n') 
        for line in lines:
            if "Task:" in line:
                task = line.split(":")[1].strip()  
            elif "Date:" in line:
                date = line.split(":")[1].strip() 
            elif "Time:" in line:
                time = line.split(":")[1].strip() 
        
        if task and date and time:
            save_event(task, date, time, "Generated event from transcription")

        return extracted_info

    except Exception as e:
        logging.error(f"Error extracting task and datetime: {str(e)}")
        return None
