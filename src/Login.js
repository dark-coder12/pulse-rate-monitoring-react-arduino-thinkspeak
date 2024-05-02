import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vid from './video/pulse_rate.mp4';

const Login = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validEmail = 'a';
  const validPassword = 'a';

  const handleLoginClick = () => {
    if (email === validEmail && password === validPassword) {
      handleLogin(); 
      navigate('/home'); 
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 to-indigo-800 pl-36 pr-36">
      <div className="flex w-128 bg-indigo-900 text-white h-5/6">

        <div className="w-1/2 overflow-hidden">
          <video
            className="w-full object-cover h-full"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={vid} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl mb-12">Your go-to 
          <br></br>Pulse Rate Monitor!</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black mb-4 px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black mb-4 px-4 py-2 rounded"
          />
          <button
            onClick={handleLoginClick}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
