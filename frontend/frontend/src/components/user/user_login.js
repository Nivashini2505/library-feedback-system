import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function UserLogin() {
  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userEmail = decoded.email;

    if (!userEmail.endsWith('@psgtech.ac.in')) {
      alert("Access restricted to @psgtech.ac.in email addresses.");
      return;
    }

    try {
      // Send email to Flask backend
      const response = await axios.post("http://localhost:5000/users/login", {
        email: userEmail
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        window.location.href = "/user/user_dashboard";
      } else {
        alert("Login failed on backend.");
      }
    } catch (err) {
      console.error("Backend error:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      <GoogleLogin 
        onSuccess={handleLoginSuccess} 
        onError={() => alert("Login Failed")} 
      />
    </div>
  );
}

export default UserLogin;
