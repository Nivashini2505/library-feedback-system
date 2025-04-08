// src/components/user/user_login.js

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function UserLogin() {
  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const userEmail = decoded.email;

    if (userEmail.endsWith('@psgtech.ac.in')) {
      // ✅ Allow access and redirect
      console.log("Access granted:", userEmail);
      window.location.href = "/user/user_dashboard";
    } else {
      // ❌ Access denied
      alert("Access restricted to @psgtech.ac.in email addresses.");
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

