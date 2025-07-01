'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppStore, getTeamMembers } from '@/lib/store';
import { Plus, Users, Megaphone, Settings, Crown, Trash2, Key, Clock} from 'lucide-react';

export default function AdminPage() {
  const { 
    currentUser, 
    announcements, 
    addAnnouncement, 
    deleteAnnouncement,
    tasks,
    passwordResetRequests,
  } = useAppStore();
  
  const teamMembers = getTeamMembers();
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
  });
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);

  // Only allow access to team leaders
  if (!currentUser?.isLeader) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-16">
          <div className="w-24 h-24 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Settings className="h-12 w-12 text-red-400" />
          </div>
          <h1 className="responsive-text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 responsive-text-lg">Only team leaders can access the admin panel.</p>
        </div>
      </Layout>
    );
  }

  const createAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title.trim() || !newAnnouncement.content.trim()) return;

    addAnnouncement({
      title: newAnnouncement.title.trim(),
      content: newAnnouncement.content.trim(),
      authorId: currentUser.id,
      authorName: currentUser.name,
    });

    setNewAnnouncement({ title: '', content: '' });
    setShowNewAnnouncement(false);
  };

  // Calculate real-time statistics
  const totalTasks = tasks.reduce((acc, task) => 
    acc + (task.subTasks?.length || 1), 0
  );
  
  const completedTasks = tasks.reduce((acc, task) => {
    if (task.subTasks) {
      return acc + task.subTasks.filter(st => st.status === 'Completed').length;
    }
    return acc + (task.status === 'Completed' ? 1 : 0);
  }, 0);

  const pendingPasswordResets = passwordResetRequests.filter(req => req.status === 'pending');

  return (
    <Layout>
      <div className="max-w-7xl mx-auto mobile-padding">
        <div className="responsive-m-8">
          <div className="flex items-center mb-3">
            <Crown className="h-6 w-6 md:h-8 md:w-8 text-yellow-400 mr-3" />
            <h1 className="responsive-text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Admin Panel</h1>
          </div>
          <p className="text-gray-400 responsive-text-lg">Team leader controls and management dashboard</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 responsive-gap-6 responsive-m-8">
          <div className="dark-card responsive-p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="responsive-text-xs font-medium text-gray-400">Total Announcements</p>
                <p className="responsive-text-2xl font-bold text-blue-400">{announcements.length}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <Megaphone className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="dark-card responsive-p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="responsive-text-xs font-medium text-gray-400">Team Members</p>
                <p className="responsive-text-2xl font-bold text-green-400">{teamMembers.length}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="dark-card responsive-p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="responsive-text-xs font-medium text-gray-400">Completed Tasks</p>
                <p className="responsive-text-2xl font-bold text-purple-400">{completedTasks}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Settings className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="dark-card responsive-p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="responsive-text-xs font-medium text-gray-400">Password Requests</p>
                <p className="responsive-text-2xl font-bold text-orange-400">{pendingPasswordResets.length}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <Key className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 responsive-gap-8">
          {/* Password Reset Requests */}
          <div className="dark-card">
            <div className="responsive-p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="responsive-text-xl font-semibold text-white flex items-center">
                  <Key className="h-5 w-5 md:h-6 md:w-6 mr-3 text-orange-400" />
                  <span className="hidden sm:inline">Password Reset Requests</span>
                  <span className="sm:hidden">Password Requests</span>
                </h3>
                {pendingPasswordResets.length > 0 && (
                  <span className="bg-orange-500/20 text-orange-300 px-2 py-1 md:px-3 md:py-1 rounded-full responsive-text-xs font-medium border border-orange-500/30">
                    {pendingPasswordResets.length} pending
                  </span>
                )}
              </div>
            </div>
            
            <div className="responsive-p-6">
              <div className="scrollable-container scrollable-md space-y-4">
                {pendingPasswordResets.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 md:h-16 md:w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 responsive-text-sm">No pending password reset requests.</p>
                  </div>
                ) : (
                  pendingPasswordResets.map(request => (
                    <div key={request.id} className="border border-gray-600 rounded-2xl responsive-p-6 bg-gray-800/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white mb-2 text-wrap">{request.userName}</h4>
                          <p className="responsive-text-sm text-gray-400 mb-2">Requested new password</p>
                          <div className="flex items-center responsive-text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {new Date(request.requestedAt).toLocaleDateString()} at {new Date(request.requestedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-3">
                        <p className="responsive-text-xs text-gray-400 mb-1">New Password:</p>
                        <p className="responsive-text-sm font-mono text-gray-300 text-wrap break-all">{request.newPassword}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Manage Announcements */}
          <div className="dark-card">
            <div className="responsive-p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="responsive-text-xl font-semibold text-white">
                  <span className="hidden sm:inline">Manage Announcements</span>
                  <span className="sm:hidden">Announcements</span>
                </h3>
                <button
                  onClick={() => setShowNewAnnouncement(true)}
                  className="btn-primary flex items-center responsive-btn"
                >
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">New Announcement</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>
            
            <div className="responsive-p-6">
              {showNewAnnouncement && (
                <form onSubmit={createAnnouncement} className="mb-6 responsive-p-6 border border-gray-600 rounded-2xl bg-gray-800/30">
                  <div className="mb-4">
                    <label className="block responsive-text-sm font-medium text-gray-300 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="Announcement title..."
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block responsive-text-sm font-medium text-gray-300 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Announcement content..."
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="btn-primary responsive-btn"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAnnouncement(false)}
                      className="btn-secondary responsive-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="scrollable-container scrollable-md space-y-4">
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 md:h-16 md:w-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 responsive-text-sm">No announcements yet. Create your first announcement!</p>
                  </div>
                ) : (
                  announcements.map(announcement => (
                    <div key={announcement.id} className="border border-gray-600 rounded-2xl responsive-p-6 bg-gray-800/30">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-white flex-1 text-wrap pr-2">{announcement.title}</h4>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="text-red-400 hover:text-red-300 p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-gray-300 responsive-text-sm mb-3 text-wrap">{announcement.content}</p>
                      <div className="flex items-center justify-between responsive-text-xs text-gray-500">
                        <span className="truncate">By {announcement.authorName}</span>
                        <span className="flex-shrink-0 ml-2">{new Date(announcement.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Team Management */}
        <div className="mt-8 dark-card">
          <div className="responsive-p-6 border-b border-gray-700">
            <h3 className="responsive-text-xl font-semibold text-white">Team Management</h3>
          </div>
          
          <div className="responsive-p-6">
            <div className="scrollable-container scrollable-lg space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between responsive-p-4 border border-gray-600 rounded-2xl bg-gray-800/30">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white responsive-text-sm font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-3 md:ml-4 min-w-0 flex-1">
                      <div className="flex items-center">
                        <p className="font-semibold text-white text-wrap pr-2">{member.name}</p>
                        {member.isLeader && (
                          <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="responsive-text-sm text-gray-400 text-wrap">{member.role}</p>
                      <p className="responsive-text-xs text-gray-500 text-wrap">{member.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:space-x-3 ml-2">
                    <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full responsive-text-xs font-medium border ${
                      member.isLeader 
                        ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    }`}>
                      {member.isLeader ? 'Leader' : 'Member'}
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" title="Online"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="mt-8 dark-card">
          <div className="responsive-p-6 border-b border-gray-700">
            <h3 className="responsive-text-xl font-semibold text-white">System Settings</h3>
          </div>
          <div className="responsive-p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 responsive-gap-8">
              <div>
                <h4 className="font-semibold text-gray-200 mb-4 responsive-text-base">Project Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">Auto-save interval</span>
                    <span className="responsive-text-sm font-medium text-white">Real-time</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">Data persistence</span>
                    <span className="responsive-text-sm font-medium text-green-400">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">Team size</span>
                    <span className="responsive-text-sm font-medium text-white">{teamMembers.length} members</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200 mb-4 responsive-text-base">System Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">Task synchronization</span>
                    <span className="responsive-text-sm font-medium text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">Chat system</span>
                    <span className="responsive-text-sm font-medium text-green-400">Online</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl">
                    <span className="responsive-text-sm text-gray-300">AI Assistant</span>
                    <span className="responsive-text-sm font-medium text-blue-400">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}