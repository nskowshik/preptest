import React, { useEffect, useState } from 'react';
import apiClient from '../../api';
import { Card, Table } from '../../ui';

const ColumnsToPick = ['name', 'subject', 'status', 'created_at'];
const Dashboard = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tests, setTests] = useState([]);
  const [columns, setColumns] = useState([]);


  const formatColumns = (data) => {
    const columns = Object.keys(data[0])
      .filter((key) => ColumnsToPick.includes(key))
      .map((key) => ({
        field: key,
        headerName: key.replace('_', ' ').toUpperCase(),
        flex: 1,
        ...(key === 'created_at' && {
          type: 'dateTime',
          valueGetter: (value) => value ? new Date(value) : null,
          valueFormatter: (value) =>
            value
              ? value.toLocaleString('en-IN')
              : '',
        }),
      }));

    setColumns(columns);
    setTests(data);
  };
  const fetchAllTest = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/tests`);
      const data = response.data;
      if (data.status === 'success') {
        formatColumns(data?.data);
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTest();
  }, []);

  if (loading) {
    return (
      <div className="position-relative h-screen overflow-y-auto font-sans">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading details...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <Table
        rows={tests}
        columns={columns}
        isLoading={loading}
      />
    </div>
  );
};

export default Dashboard;
