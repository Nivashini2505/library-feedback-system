import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/check_session');
        if (!response.data.logged_in) {
          navigate('/admin'); // Redirect to login if not logged in
        }
      } catch (error) {
        navigate('/admin'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div>
      <AdminNavbar />
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Admin Dashboard</h2>
        <div style={{ 
          display: 'grid', 
          gap: '20px', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          marginTop: '20px'
        }}>
          <DashboardCard title="Total Feedbacks" value="0" />
          <DashboardCard title="Today's Feedbacks" value="0" />
          <DashboardCard title="Active Users" value="0" />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  );
}

export default AdminDashboard;