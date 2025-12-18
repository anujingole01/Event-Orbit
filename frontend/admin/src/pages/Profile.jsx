import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Key, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showRecoveryModal, setShowRecoveryModal] = useState(false);

    const [adminDetails, setAdminDetails] = useState({
        name: '',
        email: '',
        role: 'Super Admin',
        phone: '',
        location: ''
    });

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const fetchAdminProfile = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/profile');
            if (response.data) {
                setAdminDetails({
                    name: response.data.fullName,
                    email: response.data.email,
                    role: 'Super Admin', // Keep static or fetch if role has more details
                    phone: response.data.phone || '',
                    location: response.data.location || '' // Now supported by backend
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await axios.put('http://localhost:5000/api/admin/profile', {
                fullName: adminDetails.name,
                phone: adminDetails.phone,
                location: adminDetails.location
            });
            alert('Profile updated successfully!');
            // Reflect changes locally if needed, but state is already updated via input
            // Maybe trigger a navbar refresh via context or just reload (simple way)
            // For now, just alert.
            window.location.reload(); // To update Navbar as well since it fetches on mount
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-violet-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {adminDetails.name.charAt(0)}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{adminDetails.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">{adminDetails.role}</p>

                        <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Status</span>
                                <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Joined</span>
                                <span className="text-slate-900 dark:text-white">Oct 24, 2023</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'personal' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-l-4 border-violet-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <User className="w-4 h-4 mr-3" />
                            Personal Information
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'security' ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-l-4 border-violet-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <Shield className="w-4 h-4 mr-3" />
                            Security & Recovery
                        </button>
                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
                        {activeTab === 'personal' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            value={adminDetails.name}
                                            onChange={(e) => setAdminDetails({ ...adminDetails, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email Address</label>
                                        <input
                                            type="email"
                                            value={adminDetails.email}
                                            disabled
                                            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={adminDetails.phone}
                                            onChange={(e) => setAdminDetails({ ...adminDetails, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Location</label>
                                        <input
                                            type="text"
                                            value={adminDetails.location}
                                            onChange={(e) => setAdminDetails({ ...adminDetails, location: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleUpdateProfile}
                                        className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Two-Step Verification</h3>
                                    <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
                                                <Smartphone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900 dark:text-white">Two-Factor Authentication (2FA)</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                                    Add an extra layer of security to your account. We'll verify your identity via email or SMS.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${twoFactorEnabled ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>

                                    {twoFactorEnabled && (
                                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 flex items-center">
                                            <CheckCircle className="w-5 h-5 mr-3" />
                                            <span className="text-sm">2FA is currently enabled for your account.</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Password Recovery</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                        Manage your password recovery options. In case you lose access to your account, these methods will help you restore it.
                                    </p>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Recovery Email</p>
                                                    <p className="text-xs text-slate-500">ad***@eventorbit.com</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium">Update</button>
                                        </div>

                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Key className="w-5 h-5 text-slate-400" />
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">Change Password</p>
                                                    <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                                </div>
                                            </div>
                                            <button className="text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 font-medium">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
