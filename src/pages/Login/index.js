import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/login.svg';
import branding from '../../assets/branding.svg';
import { setAuthenticated, setUser } from '../../store/authSlice';
import apiClient from '../../api'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!userId.trim() || !password.trim()) {
            setError('User ID and password are required.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post(`/auth/login`, JSON.stringify({ userId, password }));
            const data = response.data;
            if (data.status === 'success') {
                document.cookie = 'isAuthenticated=true; path=/; SameSite=Lax';
                localStorage.setItem('user', JSON.stringify(data.data.user));
                localStorage.setItem('token', data.data.token);
                dispatch(setAuthenticated(true));
                dispatch(setUser(data.data.user));
                navigate('/', { replace: true });
            } else {
                setError(data.message);
            }
        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto min-h-screen grid grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:grid-cols-2">
                <div className="hidden items-center justify-center bg-slate-100 p-10 md:flex">
                    <img
                        src={loginIllustration}
                        alt="Login illustration"
                        className="h-auto w-full max-w-md"
                    />
                </div>

                <div className="flex items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <img src={branding} alt="PrepRoute logo" className="mb-2 h-[50px] w-[120px] rounded" />
                            <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Use your company provided login credentials
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="userId" className="mb-2 block text-sm font-medium text-slate-700">
                                    User ID
                                </label>
                                <input
                                    id="userId"
                                    type="text"
                                    placeholder="Enter User ID"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                                />
                            </div>

                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <button
                                type="submit"
                                className="w-full rounded-md bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;