import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TaskList from './pages/TaskList';
import CalendarPage from './pages/Calendar';
import Recordings from './pages/RecordingList';
import NavigationBar from './components/NavigationBar';
import MicrophonePage from './pages/MicrophonePage';
import './App.css'; 

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); 
  const location = useLocation(); 

  return (
    <div className="app-background">
      <TransitionGroup>
        <CSSTransition key={location.key} classNames="page" timeout={300}>
          <Routes location={location}>
            <Route path="/" element={<MicrophonePage />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/recordings" element={<Recordings />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <NavigationBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default AppWrapper;
