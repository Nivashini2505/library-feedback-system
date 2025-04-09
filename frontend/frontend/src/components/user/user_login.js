import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserLogin() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userEmail = decoded.email;

    if (!userEmail.endsWith('@psgtech.ac.in')) {
      setError("Access restricted to @psgtech.ac.in email addresses.");
      return;
    }

    try {
      // Send email to Flask backend
      const response = await axios.post("http://localhost:5000/users/login", {
        email: userEmail
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        navigate("/feedback_entry");
      }
    } catch (err) {
      console.error("Backend error:", err);
      
      // Handle the specific error case for already submitted feedback
      if (err.response && err.response.data) {
        setError(err.response.data.message || err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      
      {/* Error message display */}
      {error && (
        <div className="error-message" style={{
          color: 'red',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: '#ffebee'
        }}>
          {error}
        </div>
      )}
      
      <GoogleLogin 
        onSuccess={handleLoginSuccess} 
        onError={() => setError("Login Failed")} 
      />
    </div>
  );
}

export default UserLogin;