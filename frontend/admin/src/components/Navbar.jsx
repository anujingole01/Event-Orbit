import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, LayoutDashboard, Calendar, Users, Briefcase, Sun, Moon, Settings, LogOut, User, Ticket } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: 'New event "Tech Summit 2025" pending approval', time: '5 min ago', isRead: false },
        { id: 2, text: 'Organizer "John Doe" registered', time: '1 hour ago', isRead: false },
        { id: 3, text: 'Monthly revenue report available', time: '2 hours ago', isRead: true },
    ]);
    const [adminInfo, setAdminInfo] = useState({
        fullName: 'Admin User',
        email: 'admin@eventorbit.com'
    });

    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        if (!isNotificationsOpen) {
            // Mark all as read when opening (optional, or just hide dot)
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
    };

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/profile');
                if (response.data) {
                    // Update specific notification or state if needed, or just keep as is
                    // But we want to use this data for the profile dropdown.
                    // We need a state for admin info.
                    setAdminInfo(response.data);
                }
            } catch (error) {
                console.error("Error fetching admin profile:", error);
            }
        };
        fetchAdminProfile();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Events', href: '/events', icon: Calendar },
        { name: 'Organizers', href: '/organizers', icon: Briefcase },
        { name: 'Users', href: '/users', icon: Users },
    ];

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-[var(--bg-card)] dark:bg-[#0f172a] border-b border-[var(--border-color)] sticky top-0 z-10 transition-colors duration-200">
            {/* Left Side (Breadcrumbs or Page Title - Optional, implies context from Sidebar) */}
            {/* Logo & Brand */}
            <div className="flex items-center mr-8">
                <Ticket className="w-8 h-8 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="text-xl font-bold text-[var(--text-page)]">
                    EO <span className="text-yellow-500">Admin</span>
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 flex-1">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                ? 'bg-violet-600 text-white'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    title="Toggle Theme"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Search - Compact Version */}
                <div className="relative hidden lg:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-4 h-4 text-[var(--text-muted)]" />
                    </span>
                    <input
                        type="text"
                        className="w-64 py-2 pl-9 pr-4 text-sm text-[var(--text-page)] bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-full focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-colors"
                        placeholder="Search events..."
                    />
                </div>

                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={toggleNotifications}
                        className="relative p-2 text-[var(--text-muted)] hover:text-[var(--text-page)] hover:bg-[var(--bg-subtle)] rounded-full transition-colors"
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div key={notification.id} className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors cursor-pointer ${!notification.isRead ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}`}>
                                            <p className="text-sm text-slate-800 dark:text-slate-200">{notification.text}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.time}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-sm text-slate-500">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-center">
                                <button className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-[var(--bg-subtle)] rounded-lg transition-colors focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold text-xs">
                            {adminInfo.fullName ? adminInfo.fullName.charAt(0).toUpperCase() : 'A'}
                        </div>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 border border-slate-200 dark:border-slate-700 z-50">
                            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{adminInfo.fullName}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{adminInfo.email}</p>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Link>
                            <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                            <button
                                className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
