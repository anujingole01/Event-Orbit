import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const Revenue = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/events');
                setEvents(res.data);

                const total = res.data.reduce((acc, event) => acc + (event.ticketsSold * event.price), 0);
                setTotalRevenue(total);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching revenue data:", error);
                setLoading(false);
            }
        };
        fetchRevenueData();
    }, []);

    // Aggregate revenue by month from actual events
    const processChartData = (eventsList) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRevenue = {};

        eventsList.forEach(event => {
            if (event.status === 'approved') { // Only count approved events or all? Assuming all for now based on previous logic, but let's stick to sold tickets
                const date = new Date(event.date);
                const month = monthNames[date.getMonth()];
                const revenue = event.ticketsSold * event.price;

                if (monthlyRevenue[month]) {
                    monthlyRevenue[month] += revenue;
                } else {
                    monthlyRevenue[month] = revenue;
                }
            }
        });

        // Ensure all months are represented or just existing ones? Let's just show existing ones sorted by date if possible, or just standard months.
        // For simplicity and chart look, let's map the months that have data or a fixed range if preferred.
        // Let's go with mapped existing months for now.

        // Better approach: Create an array for the last 6 months or current year.
        // For this iteration, let's just map the gathered data to the array format.
        return Object.keys(monthlyRevenue).map(key => ({
            name: key,
            revenue: monthlyRevenue[key]
        }));
    };

    const chartData = React.useMemo(() => processChartData(events), [events]);

    if (loading) return <div className="p-6 text-slate-500">Loading revenue details...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Analytics</h2>
                <button className="flex items-center px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹{totalRevenue.toLocaleString()}</h3>
                    <div className="mt-2 text-xs text-green-500 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>Based on ticket sales</span>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                        {events.reduce((acc, curr) => acc + curr.ticketsSold, 0).toLocaleString()}
                    </h3>
                    <div className="mt-2 text-xs text-slate-400">
                        Across all events
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Revenue per Event</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">₹{(events.length ? (totalRevenue / events.length) : 0).toFixed(0).toLocaleString()}</h3>
                </div>
            </div>

            {/* Charts */}
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue Growth</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData.length > 0 ? chartData : [{ name: 'No Data', revenue: 0 }]}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions / Event Revenue */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Event Revenue Breakdown</h3>
                    <button className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tickets Sold</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {events.map((event) => (
                                <tr key={event._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400 mr-3">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-900 dark:text-white">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(event.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                        {event.ticketsSold} / {event.totalTickets}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                                        ₹{event.price}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-green-600 dark:text-green-400 text-right">
                                        ₹{(event.ticketsSold * event.price).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Revenue;
