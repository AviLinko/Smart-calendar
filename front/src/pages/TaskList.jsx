import React, { useState, useEffect } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/get-tasks');
        const data = await response.json();
        if (data.status === 'success') {
          setTasks(data.tasks);
        } else {
          setMessage('Error fetching tasks.');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setMessage('Error fetching tasks.');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div style={styles.container}>
      <h1>Task List</h1>
      {message && <p>{message}</p>}
      <ul style={styles.list}>
        {tasks.map(task => (
          <li key={task._id} style={styles.taskItem}>
            <strong>{task.event_name}</strong> - {new Date(task.date).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    border: '2px solid #ccc',  
    padding: '10px',  
    margin: '10px 0', 
    borderRadius: '5px',  
  },
};

export default TaskList;
