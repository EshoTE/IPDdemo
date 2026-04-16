import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIDE_MENU_DATA } from "../utils/data";
import API_URL from '../config';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('name') || localStorage.getItem('email') || 'User';
  const [showProfile, setShowProfile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openProfile = () => {
    setName(localStorage.getItem('name') || '');
    setEmail(localStorage.getItem('email') || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setShowProfile(true);
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (!email.trim()) {
      setError('Email cannot be empty');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const updateBody = { name, email };
      if (newPassword) {
        updateBody.password = newPassword;
      }

      const res = await fetch(`${API_URL}/api/v1/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateBody)
      });

      if (!res.ok) {
        setError('Failed to update profile. Please try again.');
        return;
      }

      localStorage.setItem('name', name);
      localStorage.setItem('email', email);
      setSuccess('Profile updated successfully');
      setTimeout(() => {
        setShowProfile(false);
      }, 1500);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    try {
      const res = await fetch(`${API_URL}/api/v1/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        setError('Failed to delete account. Please try again.');
        setShowDeleteConfirm(false);
        return;
      }

      localStorage.clear();
      navigate('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setShowDeleteConfirm(false);
    }
  };

  const getActiveMenu = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/income') return 'Income';
    if (location.pathname === '/expense') return 'Expense';
    return 'Dashboard';
  };

  const activeMenu = getActiveMenu();

  const inputClass = "w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors";

  return (
    <>
      <div className="w-64 h-[calc(100vh-80px)] bg-[#0c0e18] border-r border-[rgba(200,150,160,0.25)] p-5 sticky top-20 z-20">

        <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
          <div className="w-20 h-20 bg-[rgba(200,150,160,0.08)] border border-[rgba(200,150,160,0.15)] rounded-full flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <button
            onClick={openProfile}
            className="text-[#f0e8ea] font-medium leading-6 hover:text-[#c896a0] transition-colors cursor-pointer"
          >
            {userName}
          </button>
        </div>

        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-base ${
              activeMenu === item.label
                ? "text-white bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)]"
                : "text-[rgba(240,232,234,0.35)] hover:bg-[rgba(200,150,160,0.05)] hover:text-[#f0e8ea] border border-transparent"
            } py-3 px-6 rounded-lg mb-3 transition-all duration-300`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}

      </div>

      {showProfile && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(200,150,160,0.15)] rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Profile Settings</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors text-lg">
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[rgba(208,136,136,0.08)] border border-[rgba(208,136,136,0.15)] rounded-lg">
                <p className="text-sm text-[#d08888]">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-[rgba(138,184,160,0.08)] border border-[rgba(138,184,160,0.15)] rounded-lg">
                <p className="text-sm text-[#8ab8a0]">{success}</p>
              </div>
            )}

            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-[rgba(200,150,160,0.08)] border border-[rgba(200,150,160,0.15)] rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">👤</span>
              </div>
              <p className="text-xs text-[rgba(255,255,255,0.3)]">User ID: {localStorage.getItem('userId')}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={inputClass}
              />
            </div>

            <div className="mb-4 pt-4 border-t border-[rgba(200,150,160,0.08)]">
              <p className="text-xs text-[rgba(255,255,255,0.4)] mb-3">Change password (leave blank to keep current)</p>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#f0e8ea] mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className={inputClass}
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProfile(false)}
                className="flex-1 py-3 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className="flex-1 py-3 bg-[#c896a0] text-[#0c0e18] rounded-lg hover:opacity-90 transition-colors font-semibold">
                Save Changes
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[rgba(200,150,160,0.08)]">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-2.5 text-sm text-[#d08888] hover:bg-[rgba(208,136,136,0.08)] rounded-lg transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-[#0c0e18] border border-[rgba(208,136,136,0.2)] rounded-2xl p-8 w-full max-w-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-[rgba(208,136,136,0.1)] border border-[rgba(208,136,136,0.2)] rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-sm text-[rgba(255,255,255,0.5)] text-center">
                This will permanently delete your account and all your data including transactions, term plans, and instalments. This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full py-3 bg-[#d08888] text-white rounded-lg hover:opacity-90 transition-colors font-semibold">
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;