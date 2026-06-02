import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Login from './pages/Login';

const App = () => {


    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/auth/login`);
            const data = await response.json();
            console.log(data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <Layout />
            <Routes>
                <Route
                    path="/"
                    element={
                        <main>
                            <h1>PrepTest</h1>
                        </main>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
};

export default App;