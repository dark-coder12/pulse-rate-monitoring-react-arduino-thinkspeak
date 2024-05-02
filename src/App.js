import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import PulseRateMonitoring from './PulseRateMonitoring';
import LandingPage from './LandingPage';
import './App.css';

const App = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsUserLoggedIn(true);
    };

    const handleLogout = () => {
        setIsUserLoggedIn(false);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/home"
                    element={
                        isUserLoggedIn ? (
                          <LandingPage />
                        ) : (
                          <Navigate to="/" replace={true} />
                        )
                    }
                />
                <Route
                    path="/"
                    element={<Login handleLogin={handleLogin} />}
                />
                <Route
                    path="/pulse-rate-monitoring"
                    element={
                        isUserLoggedIn ? (
                            <PulseRateMonitoring />
                        ) : (
                            <Navigate to="/" replace={true} />
                        )
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
