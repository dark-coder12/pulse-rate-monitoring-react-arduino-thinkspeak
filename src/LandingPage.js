import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    const redirectToMonitoring = () => {
        navigate('/pulse-rate-monitoring');
    };

    return (
        <div className="bg-gradient-to-br from-purple-700 to-indigo-900 min-h-screen flex flex-col justify-center items-center text-white">
            <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Pulse Monitoring</h1>
            <div className="flex space-x-4">
                <button className="bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg shadow-lg transition-colors duration-300 ease-in-out" onClick={redirectToMonitoring}>Get Pulse Details</button>
                
                <button className="bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg shadow-lg transition-colors duration-300 ease-in-out" onClick={redirectToMonitoring}>View Logs</button>
            </div>
        </div>
    );
}

export default LandingPage;
