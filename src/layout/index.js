import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import branding from '../assets/branding.svg';
import { setAuthenticated } from '../store/authSlice';

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const navItems = useMemo(
        () => [
            { to: '/', label: 'Dashboard' },
            { to: '/test-creation', label: 'Test Creation' },
            { to: '/test-tracking', label: 'Test Tracking' },
        ],
        []
    );

    const pageTitle = useMemo(() => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/test-creation')) return 'Test Creation';
        if (path.startsWith('/test-tracking')) return 'Test Tracking';
        if (path.startsWith('/settings')) return 'Settings';
        return 'PrepRoute';
    }, [location.pathname]);

    const closeMobileSidebar = () => setMobileSidebarOpen(false);

    const handleLogout = () => {
        document.cookie = 'isAuthenticated=false; path=/; SameSite=Lax';
        localStorage.removeItem('token');
        dispatch(setAuthenticated(false));
        navigate('/login', { replace: true });
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            {/* Mobile overlay */}
            {mobileSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={closeMobileSidebar}
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
                <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
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
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                                    ].join(' ')
                                }
                                end={item.to === '/'}
                            >
                                <span className="h-2 w-2 rounded-full bg-slate-300" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="mt-6 border-t border-slate-200 pt-4">
                        <NavLink
                            to="/settings"
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                                    isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                                ].join(' ')
                            }
                        >
                            <span className="h-2 w-2 rounded-full bg-slate-300" />
                            <span>Settings</span>
                        </NavLink>
                    </div>
                </nav>
            </aside>
            
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

                    <div className="min-w-0">
                        <div className="truncate text-sm text-slate-500">{pageTitle}</div>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <button
                            type="button"
                            aria-label="Notifications"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                                    <div className="text-sm font-medium text-slate-900">Alex Wando</div>
                                    <div className="text-xs text-slate-500">Admin</div>
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

            {/* Page content */}
            <main className="p-4 sm:p-6">
                <div className="min-h-[calc(100dvh-4rem)] rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    ); 
};

export default Layout;