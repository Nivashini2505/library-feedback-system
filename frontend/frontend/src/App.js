  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

  import AdminLogin from './components/admin/admin_login';
  import AdminDashboard from './components/admin/admin_dashboard';
  import FeedbackManagement from './components/admin/AdminQuestions';
  
  import UserLogin from './components/user/user_login';
  import LibraryFeedbackForm from './components/user/UserFeedback';
    

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/questions" element={<FeedbackManagement />} />

          <Route path="/" element={<UserLogin />} />
          <Route path="/feedback_entry" element={<LibraryFeedbackForm />} />
        </Routes>
      </Router>
    );
  }

  export default App;
