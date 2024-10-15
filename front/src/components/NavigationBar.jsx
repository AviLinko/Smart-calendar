import React from 'react';
import { FaHome, FaList, FaCalendarAlt, FaMicrophone } from 'react-icons/fa';
import { RiRecordMailLine } from "react-icons/ri";
import { Link, useLocation } from 'react-router-dom';

function NavigationBar() {
  const location = useLocation(); 

  return (
    <nav style={styles.navigationBar}>
      <Link to="/" style={location.pathname === '/' ? { ...styles.button, ...styles.active } : styles.button}>
        <FaMicrophone style={styles.icon} />
        <span style={styles.label}></span>
      </Link>
      <Link to="/tasks" style={location.pathname === '/tasks' ? { ...styles.button, ...styles.active } : styles.button}>
        <FaList style={styles.icon} />
        <span style={styles.label}></span>
      </Link>
      <Link to="/calendar" style={location.pathname === '/calendar' ? { ...styles.button, ...styles.active } : styles.button}>
        <FaCalendarAlt style={styles.icon} />
        <span style={styles.label}></span>
      </Link>
      <Link to="/recordings" style={location.pathname === '/recordings' ? { ...styles.button, ...styles.active } : styles.button}>
        <RiRecordMailLine style={styles.icon} />
        <span style={styles.label}></span>
      </Link>
    </nav>
  );
}

export default NavigationBar;

const styles = {
  navigationBar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    borderTop: '1px solid #ccc',
    boxSizing: 'border-box',
    zIndex: 1000,
  },
  button: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#666', 
  },
  active: {
    color: '#134B70', 
  },
  icon: {
    fontSize: '24px',
  },
  label: {
    fontSize: '12px',
  },
};
