import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TestCreation from './pages/TestCreation';
import TestTracking from './pages/TestTracking';
import Settings from './pages/Settings';
import QuestionPage from './pages/TestCreation/QuestionPage';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="test-creation" element={<TestCreation />} />
        <Route path="test-questions/:testId" element={<QuestionPage />} />
        <Route path="test-tracking" element={<TestTracking />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
