import React, { useState, useRef } from "react";
import { FaMicrophone } from "react-icons/fa";

const MicrophonePage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [message, setMessage] = useState(""); 
  const [transcription, setTranscription] = useState(""); 
  const [taskDetails, setTaskDetails] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  const [scanStatus, setScanStatus] = useState(""); 
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream); 
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" }); 
        const audioURL = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setAudioURL(audioURL);
        audioChunks.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setMessage(""); 
    } catch (error) {
      console.error("Error accessing microphone", error);
      setMessage("Error accessing microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => {
    setRecordedAudio(null);
    setAudioURL(null);
    setIsRecording(false);
    setTranscription(""); 
    setTaskDetails(null); 
    setScanStatus(""); // איפוס הסטטוס
  };

  const saveRecording = async () => {
    const formData = new FormData();
    formData.append("recording", recordedAudio, "recording.webm"); 

    try {
      const response = await fetch("/save-recording", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        setMessage("Recording saved successfully.");
      } else {
        setMessage("Error saving recording.");
      }
    } catch (error) {
      console.error("Error saving recording:", error);
      setMessage("Error saving recording.");
    }
  };

  const scanRecording = async () => {
    setIsLoading(true);  
    const formData = new FormData();
    formData.append("recording", recordedAudio, "recording.webm"); 

    try {
      const response = await fetch("http://localhost:5000/scan-recording", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.transcription) {
        setTranscription(result.transcription); 
        setMessage("Transcription completed.");
        setScanStatus("Successfully scanned!"); 
        await analyzeTranscription(result.transcription);
      } else {
        setScanStatus("Error scanning recording."); 
        setMessage("Error scanning recording.");
      }
    } catch (error) {
      setScanStatus("Error scanning recording."); 
      console.error("Error scanning recording:", error);
      setMessage("Error scanning recording.");
    } finally {
      setIsLoading(false);  
    }
  };

  const analyzeTranscription = async (transcription) => {
    try {
      const response = await fetch("http://localhost:5000/extract-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription }),
      });

      const result = await response.json();
      if (result.gpt_response) {
        setTaskDetails(result.gpt_response); 
        
      } else {
        setMessage("Error analyzing transcription.");
      }
    } catch (error) {
      console.error("Error analyzing transcription:", error);
      setMessage("Error analyzing transcription.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.microphoneContainer}>
        {message && <p>{message}</p>}
        {transcription && (
          <div style={styles.transcriptionContainer}>
            <strong>Transcription:</strong> {transcription}
          </div>
        )}
        {scanStatus && <p><strong>Status:</strong> {scanStatus}</p>} 
        {!recordedAudio ? (
          <div
            style={styles.microphoneButton}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <FaMicrophone style={styles.icon} />
            <span style={styles.text}>
              {isRecording ? "Recording..." : "Start Recording"}
            </span>
          </div>
        ) : (
          <div style={styles.controls}>
            <audio controls src={audioURL} style={styles.audioPlayer}></audio>
            <div style={styles.buttonsContainer}>
              <button
                onClick={deleteRecording}
                className="action-button"
              >
                Cancel
              </button>
              <button
                onClick={saveRecording}
                className="action-button"
              >
                Save
              </button>
              <button
                onClick={scanRecording}
                className="action-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="spinner">
                    Scanning... 
                  </div>
                ) : (
                  "Scan"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  microphoneContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  transcriptionContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  microphoneButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderRadius: "50%",
    width: "180px",
    height: "180px",
    color: "#fff",
    cursor: "pointer",
    border: "none",
  },
  icon: {
    fontSize: "70px",
  },
  text: {
    marginTop: "10px",
    fontSize: "14px",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  audioPlayer: {
    marginBottom: "20px",
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
  },
  actionButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default MicrophonePage;
