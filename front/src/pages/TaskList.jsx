import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-tasks');
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

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/delete-task/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
        setMessage('Task deleted successfully.');
      } else {
        setMessage('Error deleting task.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setMessage('Error deleting task.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Task List</h1>
      {message && <p>{message}</p>}
      <ul style={styles.list}>
        {tasks.map(task => (
          <li key={task._id} style={styles.listItem}>
            <div style={styles.taskContainer}>
              <strong>{task.event_name}</strong> - {new Date(task.date).toLocaleString()}
            </div>
            <FaTrash
              style={styles.icon}
              onClick={() => deleteTask(task._id)} // קריאה למחיקת המשימה
            />
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
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  taskContainer: {
    flex: 1,
  },
  icon: {
    cursor: 'pointer',
    fontSize: '20px',
    color: 'red',
    marginLeft: '10px',
  },
};

export default TaskList;
