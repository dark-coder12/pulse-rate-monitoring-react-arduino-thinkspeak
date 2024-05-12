import React, { useState } from 'react';
import axios from 'axios';

const BuzzerControl = () => {
  const [buzzerState, setBuzzerState] = useState('');

  const sendCommand = (command) => {
    axios
      .post('http://localhost:5000/buzzer', { "command" : "on" }) // Change to match your Express server URL
      .then((response) => {
        console.log(response.data);
        //fetchBuzzerState();
      })
      .catch((error) => {
        console.error('Error sending command:', error);
      });
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Buzzer Control</h2>
      <p className="mb-4">Buzzer State: {buzzerState}</p>
      <div className="flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
          onClick={() => sendCommand('on')}
        >
          Turn On
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          onClick={() => sendCommand('off')}
        >
          Turn Off
        </button>
      </div>
    </div>
  );
};

export default BuzzerControl;