# VoiceTasker

## Overview

**VoiceTasker** is a voice-based task and event manager that allows users to record voice inputs, 
which are then transcribed into text and analyzed using GPT-3.5 Turbo to extract relevant information such as task details, dates, and times. 
These tasks are then saved to a calendar and a task list, helping users manage their schedule more effectively. 
Users can scan recordings, and tasks are automatically added to the app’s internal calendar and displayed on the task list page.

## Key Features

- **Voice Recording and Transcription:** Record voice inputs through the app's microphone interface. The app uses the Google Cloud Speech-to-Text API to transcribe voice inputs into text.
- **Task Analysis with GPT-3.5 Turbo:** Once transcribed, the text is analyzed by GPT-3.5 Turbo to extract task details, including task name, date, and time.
- **Task Scheduling:** After scanning and analyzing the voice input, the extracted task and event details are saved into the app’s calendar and task list.
- **Calendar View:** Users can view scheduled tasks and events in a calendar format, where dates with events are highlighted, and events are displayed below the calendar.
- **Task List View:** A detailed task list view that displays all tasks and their corresponding dates and times.
- **Recordings Management:** View, play, and delete saved recordings through a dedicated recording management page.
- **Responsive UI:** The application is fully responsive and works across different screen sizes, including desktop and mobile.

## Technologies Used

### Frontend:
- **React**: JavaScript library for building user interfaces. The frontend is implemented using React.
- **Vite**: A fast build tool and development server that was used to scaffold and build the frontend application.
- **CSS Animations**: Used for providing feedback through animations (e.g., transitions, loading spinners).
- **React Icons**: Used for integrating icons (like the microphone and play buttons).
- **React-Router-Dom**: For routing between different pages in the application, such as the Task List, Calendar, and Microphone page.

### Backend:
- **Flask**: A lightweight Python web framework that handles the backend functionality, including API requests for recordings, transcriptions, and task management.
- **Google Cloud Speech-to-Text API**: For transcribing voice recordings into text.
- **OpenAI GPT-3.5 Turbo**: For analyzing transcriptions and extracting relevant information such as task names, dates, and times.
- **MongoDB**: A NoSQL database used to store recordings and events/tasks.
- **Pydub**: For handling audio file formats and processing audio data in the backend.

### Build Process:
- **Vite Build**: The frontend is built using Vite and compiled into static assets (`dist` folder).
- **Flask Static Serving**: The compiled frontend assets are then served through the Flask backend under the `static` folder,
    making it easy to deploy both the frontend and backend as a single unit.
- **Cross-Origin Resource Sharing (CORS)**: CORS is enabled in the backend to allow frontend-backend communication during development and production.

## Running the Application

### Option 1: Combined Build (Single Repository)

1. **Frontend Build**:
    - Navigate to the `front` directory:
      ```bash
      cd front
      npm install
      npm run build
      ```
    - Copy the contents of the `dist` folder (after the build) to the backend's `static` folder:
      ```bash
      cp -r dist/* ../backend/static/
      ```

2. **Backend Setup**:
    - Ensure you have a `.env` file set up in the `backend` folder containing your Google Cloud and OpenAI API keys.
    - Start the Flask server from the `backend` directory:
      ```bash
      cd backend
      python -m flask run
      ```
3. Once the Flask server is running, you can access the application from your browser at:
    ```
    http://127.0.0.1:5000
    ```

### Option 2: Separate Frontend and Backend Repositories (Two Repositories)

If you prefer to run the frontend and backend as two separate repositories, follow these steps:

1. **Frontend**:
    - In the `front` folder, configure the `vite.config.js` file to point to the backend API URL:
      ```js
      server: {
        proxy: {
          '/api': 'http://localhost:5000'
        }
      }
      ```
    - Start the frontend development server:
      ```bash
      cd front
      npm install
      npm run dev
      ```

2. **Backend**:
    - Follow the backend setup steps as outlined above.
    - Once both the frontend and backend are running, the frontend will communicate with the backend via the proxy.

## Environment Variables

You need to set up environment variables for API keys and MongoDB connection. Here's an example `.env` file for the `backend` folder:

