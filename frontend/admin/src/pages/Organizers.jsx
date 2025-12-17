import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, XCircle, Eye } from 'lucide-react';
import axios from 'axios';

const Organizers = () => {
    const [organizers, setOrganizers] = useState([]);

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/organizers');
                setOrganizers(res.data);
            } catch (error) {
                console.error("Error fetching organizers", error);
            }
        };

        fetchOrganizers();
        const interval = setInterval(fetchOrganizers, 5000);

        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'verified': return 'bg-green-500/10 text-green-500';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500';
            case 'rejected': return 'bg-red-500/10 text-red-500';
            default: return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Organizer Verification</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search organizers..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 uppercase text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <tr>
                            <th className="px-6 py-4">Organizer</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Wallet</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {organizers.length > 0 ? organizers.map((org) => (
                            <tr key={org._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-medium text-slate-900 dark:text-white">{org.fullName}</p>
                                    <p className="text-xs text-slate-500">ID: {org._id}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-slate-900 dark:text-slate-300">{org.email}</p>
                                    <p className="text-xs text-slate-500">{org.phone || 'No phone'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    ₹{org.walletBalance || 0}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                    No organizers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Organizers;
