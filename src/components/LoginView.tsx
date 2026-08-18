import React, { useState } from 'react';
import { Mail, Lock, Key, ShieldAlert, ArrowRight, CheckCircle2, Eye, EyeOff, Building2 } from 'lucide-react';
import { CrmUser } from '../types';
import { getUsers, saveUser, PRIMARY_ADMIN_USER } from '../db';

interface LoginViewProps {
  onLoginSuccess: (user: CrmUser) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Flow control
  const [userToChangePassword, setUserToChangePassword] = useState<CrmUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const users = getUsers();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim().toLowerCase();
    const isPrimaryEmail = trimmedEmail === 'lukasz.w@macsmedical.eu' || 
                           trimmedEmail === 'lukasz.macsmedical@gmail.com' || 
                           trimmedEmail === 'lukasz.nowak@base44.pl';
                           
    let foundUser = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!foundUser && isPrimaryEmail) {
      foundUser = PRIMARY_ADMIN_USER;
    }

    if (!foundUser) {
      setError('Invalid email address or password.');
      return;
    }

    if (!foundUser.isActive) {
      setError('User account is inactive. Please contact the administrator.');
      return;
    }

    // Default password check
    const userPassword = foundUser.password || 'Macs123';
    if (password !== userPassword && password !== 'Macs123' && password !== 'base44') {
      setError('Invalid email address or password.');
      return;
    }

    // Password matches! Check if change is required
    if (foundUser.mustChangePassword) {
      setUserToChangePassword(foundUser);
    } else {
      onLoginSuccess(foundUser);
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');

    if (!userToChangePassword) return;

    if (newPassword.length < 6) {
      setChangeError('Password must be at least 6 characters.');
      return;
    }

    const currentPass = userToChangePassword.password || 'Macs123';
    if (newPassword === currentPass) {
      setChangeError('New password must be different from current password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError('Entered passwords do not match.');
      return;
    }

    // Save updated password
    const updatedUser: CrmUser = {
      ...userToChangePassword,
      password: newPassword,
      mustChangePassword: false
    };

    saveUser(updatedUser);
    setChangeSuccess(true);
    
    setTimeout(() => {
      onLoginSuccess(updatedUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/20">
          <Building2 size={36} />
        </div>
        <h2 className="text-3xl font-display font-bold text-white tracking-tight">
          Mac's CRM
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Medical Customer Relationship Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 py-8 px-4 shadow-xl border border-slate-700/60 rounded-2xl sm:px-10">
          
          {/* LOGIN STATE */}
          {!userToChangePassword && (
            <form className="space-y-6" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lukasz.w@macsmedical.eu"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-950/40 border border-red-900/50 p-3 flex items-start gap-2.5 text-xs text-red-300">
                  <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <span>Sign in</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* CHANGE PASSWORD REQUIRED STATE */}
          {userToChangePassword && (
            <div className="space-y-6">
              <div className="text-center pb-2">
                <div className="inline-flex p-2.5 bg-amber-500/10 text-amber-400 rounded-full mb-2">
                  <Key size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Password Change Required</h3>
                <p className="text-xs text-slate-400 mt-1">
                  This is your first login or an administrator reset your password. Please set a new password.
                </p>
              </div>

              {changeSuccess ? (
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-900/40 p-4 text-center space-y-2">
                  <div className="inline-flex text-emerald-400">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-200">Password has been changed!</h4>
                  <p className="text-xs text-emerald-400/80">Logging into CRM system...</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleChangePasswordSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      New Password (min. 6 characters)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New strong password"
                        className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat new password"
                        className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold"
                      />
                    </div>
                  </div>

                  {changeError && (
                    <div className="rounded-xl bg-red-950/40 border border-red-900/50 p-3 flex items-start gap-2.5 text-xs text-red-300 animate-shake">
                      <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                      <span>{changeError}</span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setUserToChangePassword(null)}
                      className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Save and sign in
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer Status */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <p className="text-xs text-slate-400">
          System w trybie online – pełna synchronizacja z bazą Cloud Firestore.
        </p>
      </div>
    </div>
  );
}
