import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ login_count: 0, feedback_count: 0 });
  const [days, setDays] = useState(1); // Default days

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

  useEffect(() => {
    const fetchCombinedCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/combined_count?days=${days}`);
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch combined counts:', err);
      }
    };

    fetchCombinedCount();
  }, [days]);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  // Prepare data for the charts
  const chartData = {
    labels: ['Total Logins', 'Total Feedbacks'], // Labels for the chart
    datasets: [
      {
        label: 'Submission rate',
        data: [data.login_count, data.feedback_count], // Corresponding counts
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <AdminNavbar />
      <h2 style={styles.title}>Admin Dashboard</h2>
      <div style={styles.selectContainer}>
        <label htmlFor="days" style={styles.label}>Enter Number of Days: </label>
        <input
          type="number"
          id="days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          min="1"
          style={styles.input}
        />
      </div>
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Login and Feedback Count</h3>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Total Logins and Feedbacks for Last X Days',
              },
            },
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  selectContainer: {
    marginBottom: '20px',
  },
  label: {
    marginRight: '10px',
    fontSize: '16px',
  },
  input: {
    padding: '5px',
    fontSize: '16px',
    width: '100px',
  },
  chartContainer: {
    width: '100%',
    height: '300px', // Set height for the chart
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  chartTitle: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default AdminDashboard;