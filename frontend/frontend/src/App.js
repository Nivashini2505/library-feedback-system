  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

  import AdminLogin from './components/admin/admin_login';
  import AdminDashboard from './components/admin/admin_dashboard';
  
  import UserLogin from './components/user/user_login';
  import UserDashboard from './components/user/user_dashboard';
    

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/" element={<UserLogin />} />
          <Route path="/faadback_entry" element={<UserDashboard />} />
        </Routes>
      </Router>
    );
  }

  export default App;
