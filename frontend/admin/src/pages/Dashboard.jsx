import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Briefcase, IndianRupee, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrganizers: 0,
        totalEvents: 0,
        pendingEvents: 0,
        totalRevenue: 0,
        chartData: []
    });
    const [pendingEventsList, setPendingEventsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/stats'),
                axios.get('http://localhost:5000/api/admin/pending-events')
            ]);

            setStats(statsRes.data);
            setPendingEventsList(pendingRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch

        const interval = setInterval(() => {
            fetchData(); // Poll every 10 seconds
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'bg-green-500',
            onClick: () => navigate('/revenue')
        },
        { title: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-violet-500' },
        { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
        { title: 'Organizers', value: stats.totalOrganizers, icon: Briefcase, color: 'bg-orange-500' },
    ];

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        onClick={card.onClick}
                        className={`p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:transform hover:scale-105 transition-all ${card.onClick ? 'cursor-pointer hover:border-violet-500 dark:hover:border-violet-500' : ''}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{card.title}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color} bg-opacity-20 text-white`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-400">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            <span>Real-time updates</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="hidden hidden lg:block lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Event Analytics (Monthly)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData || []}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="events" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pending Approvals */}
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pending Approvals</h3>
                    <div className="space-y-4">
                        {pendingEventsList.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No pending events.</p>
                        ) : (
                            pendingEventsList.map((event) => (
                                <div key={event._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300">
                                            {event.title.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate w-32">{event.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">by {event.organizer?.fullName || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Pending</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
