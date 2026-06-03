import React, { useMemo, useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import branding from '../assets/branding.svg';
import { setAuthenticated } from '../store/authSlice';
import DashboardIcon from '../assets/dashboard.svg?react';
import CreationIcon from '../assets/creation.svg?react';
import TrackingIcon from '../assets/tracking.svg?react';

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();



    const user = useSelector((state) => state.auth.user);

    const isTestCreationPage = location?.pathname?.includes('test-questions');

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(isTestCreationPage);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const navItems = useMemo(
        () => [
            { to: '/', label: 'Dashboard', icon: DashboardIcon },
            { to: '/test-creation', label: 'Test Creation', icon: CreationIcon },
            { to: '/test-tracking', label: 'Test Tracking', icon: TrackingIcon },
        ],
        []
    );


    const closeMobileSidebar = () => setMobileSidebarOpen(false);



    const handleLogout = () => {
        document.cookie = 'isAuthenticated=false; path=/; SameSite=Lax';
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(setAuthenticated(false));
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex min-w-screen  w-[100%] min-h-screen bg-slate-100">
            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => closeMobileSidebar()}
                    className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
                />
            )}

            {/* Sidebar */}

            <aside
                className={[
                    'fixed left-0 top-0 z-50 h-dvh w-72 border-r border-slate-200 bg-white md:translate-x-0',
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                    'transition-transform duration-200 ease-out md:static md:z-auto md:h-auto',
                ].join(' ')}
            >
                <div className="flex h-16 items-center gap-3 px-4">
                    <img src={branding} alt="PrepRoute logo" className="h-8 w-auto" />
                </div>

                <nav className="px-3 py-4">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={closeMobileSidebar}
                                className={({ isActive }) =>
                                    [
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                                        isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-indigo-500'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                                    ].join(' ')
                                }
                                end={item.to === '/'}
                            >
                                <item.icon alt={item.label} className="h-4 w-auto" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Main column */}
            <div className='w-[100%]'>
                {/* Top toolbar */}
                <div >
                    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
                        <div className="flex h-16 items-center gap-3 px-4">
                            <button
                                type="button"
                                aria-label="Open sidebar"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 md:hidden"
                            >
                                Menu
                            </button>

                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label="Notifications"
                                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                >
                                    <span className="text-base">🔔</span>
                                </button>

                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setProfileMenuOpen((v) => !v)}
                                        onBlur={() => setProfileMenuOpen(false)}
                                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 hover:bg-slate-50"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                                            A
                                        </div>
                                        <div className="hidden text-left sm:block">
                                            <div className="text-sm font-medium capitalize text-slate-900">{user?.name?.toLowerCase()}</div>
                                            <div className="text-xs capitalize text-slate-500">{user?.role}</div>
                                        </div>
                                        <div className="hidden text-slate-500 sm:block">▾</div>
                                    </button>

                                    {profileMenuOpen && (
                                        <div
                                            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                                            role="menu"
                                        >
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                    setProfileMenuOpen(false);
                                                    navigate('/settings');
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                Settings
                                            </button>
                                            <button
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={handleLogout}
                                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Page content */}
                <div >
                    <main>
                        <div className="min-h-[calc(100dvh-4rem)]  bg-white">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;