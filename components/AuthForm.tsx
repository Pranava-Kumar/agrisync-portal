'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Eye, EyeOff, User, Lock, Bone as Drone, UserPlus, Key } from 'lucide-react';

export default function AuthForm() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { login, register, requestPasswordReset } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const success = await login(username, password);
        if (!success) {
          setError('Invalid credentials. Please try again.');
        }
      } else if (mode === 'register') {
        if (!username.trim() || !password.trim()) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        
        const success = await register(username.trim(), password);
        if (success) {
          setSuccess('Registration successful! You can now login.');
          setMode('login');
          setUsername('');
          setPassword('');
        } else {
          setError('User already exists. Please try a different name.');
        }
      } else if (mode === 'forgot') {
        if (!username.trim() || !newPassword.trim()) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
        }
        
        const success = await requestPasswordReset(username.trim(), newPassword);
        if (success) {
          setSuccess('Password reset request sent to admin for approval. You will be notified once approved.');
          setMode('login');
          setUsername('');
          setPassword('');
          setNewPassword('');
        } else {
          setError('User not found or you already have a pending request.');
        }
      }
    } catch (err) {
      setError('Operation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setNewPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Drone className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">AgriSync-X Portal</h1>
            <p className="text-blue-200 text-lg">Team Management & Collaboration Platform</p>
            <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
              <p className="text-sm text-blue-200">🚁 NIDAR Drone Competition Project</p>
            </div>
          </div>

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-700/50 rounded-xl p-1">
            <button
              onClick={() => {
                setMode('login');
                resetForm();
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                mode === 'login' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                resetForm();
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                mode === 'register' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setMode('forgot');
                resetForm();
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                mode === 'forgot' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Reset Password
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {mode === 'register' ? 'Full Name' : 'Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={mode === 'register' ? "Enter your full name" : "Enter your name or ID"}
                  required
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Admin approval required for password reset
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
                <p className="text-sm text-green-200">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {mode === 'login' ? 'Authenticating...' : mode === 'register' ? 'Registering...' : 'Requesting...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {mode === 'login' ? (
                    <>
                      <User className="w-5 h-5 mr-2" />
                      Enter Portal
                    </>
                  ) : mode === 'register' ? (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Request Reset
                    </>
                  )}
                </div>
              )}
            </button>
          </form>       

          {mode === 'register' && (
            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <p className="text-xs text-blue-300">
                📝 New users can register with just their name and password. Role and specialization will be assigned by the admin.
              </p>
            </div>
          )}

          {mode === 'forgot' && (
            <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
              <p className="text-xs text-yellow-300">
                🔐 Password reset requests require admin approval. You'll be notified once your request is processed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}