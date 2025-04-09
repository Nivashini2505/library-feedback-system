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
  const [loginData, setLoginData] = useState([]);
  const [period, setPeriod] = useState('weekly'); // Default period

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/check_session');
        if (!response.data.logged_in) {
          navigate('/admin/login'); // Redirect to login if not logged in
        }
      } catch (error) {
        navigate('/admin/login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchLoginCount = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/login_count?period=${period}`);
        setLoginData(response.data);
      } catch (err) {
        console.error('Failed to fetch login counts:', err);
      }
    };

    fetchLoginCount();
  }, [period]);

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  // Prepare data for the chart
  const chartData = {
    labels: loginData.map(entry => entry.period), // Labels based on period (dates)
    datasets: [
      {
        label: 'Total Logins',
        data: loginData.map(entry => entry.login_count), // Corresponding login counts
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        <label htmlFor="period" style={styles.label}>Select Time Period: </label>
        <select
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={styles.select}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Login Count</h3>
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
                text: 'Total Logins for Selected Period',
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
  select: {
    padding: '5px',
    fontSize: '16px',
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