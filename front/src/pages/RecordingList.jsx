import React, { useState, useEffect } from "react";
import { FaPlay, FaTrash } from "react-icons/fa"; 

const RecordingList = () => {
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); 

  const fetchRecordings = async () => {
    try {
      setLoading(true);  
      const response = await fetch("/get-recordings");
      const data = await response.json();

      if (data && Array.isArray(data.recordings)) {
        setRecordings(data.recordings);  
      } else {
        setMessage("No recordings found.");
        setRecordings([]);  
      }
    } catch (error) {
      console.error("Error fetching recordings:", error);
      setMessage("Error fetching recordings.");
    } finally {
      setLoading(false);  
    }
  };

  const playRecording = async (id) => {
    try {
      const audio = new Audio(`/play-recording/${id}`);
      audio.play();
    } catch (error) {
      console.error("Error playing recording:", error);
      setMessage("Error playing recording.");
    }
  };

  const deleteRecording = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-recording/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setMessage("Recording deleted successfully.");
        fetchRecordings();  
      } else {
        setMessage("Error deleting recording.");
        console.error("Error deleting recording");
      }
    } catch (error) {
      console.error("Error deleting recording:", error);
      setMessage("Error deleting recording.");
    }
  };

  useEffect(() => {
    fetchRecordings();  
  }, []);

  return (
    <div>
      <h1>Recordings List</h1>
      {message && <p>{message}</p>} 
      
      {loading ? ( 
        <div className="spinner"></div> 
      ) : (
        <ul style={styles.list}>
          {recordings.length > 0 ? (
            recordings.map((recording) => (
              <li key={recording._id} style={styles.listItem}>
                <span>{recording.filename}</span>
                <div style={styles.iconContainer}>
                  <FaPlay style={styles.icon} onClick={() => playRecording(recording._id)} /> 
                  <FaTrash style={styles.icon} onClick={() => deleteRecording(recording._id)} />
                </div>
              </li>
            ))
          ) : (
            <p>No recordings available.</p>  
          )}
        </ul>
      )}
    </div>
  );
};

const styles = {
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: "10px 0",
    borderBottom: "1px solid #ccc",
  },
  iconContainer: {
    display: "flex",
    gap: "15px",  
  },
  icon: {
    cursor: "pointer",
    fontSize: "20px",
  },
};

export default RecordingList;
