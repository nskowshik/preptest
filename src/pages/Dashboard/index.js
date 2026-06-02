import React, { useEffect, useState } from 'react';
import apiClient from '../../api';
import { Card, Table } from '../../ui';

const Dashboard = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);

  const fetchAllTest = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/tests`);
      const data = response.data;
      if (data.status === 'success') {
        setTests(data?.data);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTest();
  }, []);

  if (loading) {
    <div>Loading...</div>;
  }
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <Table/>
      <Card>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Song</th>
              <th>Artist</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
              <td>Malcolm Lockyer</td>
              <td>1961</td>
            </tr>
            <tr>
              <td>Witchy Woman</td>
              <td>The Eagles</td>
              <td>1972</td>
            </tr>
            <tr>
              <td>Shining Star</td>
              <td>Earth, Wind, and Fire</td>
              <td>1975</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Dashboard;
