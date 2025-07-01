'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import DashboardWidget from '@/components/DashboardWidget';
import { useAppStore, getTeamMembers } from '@/lib/store';
import { 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Send,
  Zap,
  Activity,
  Sparkles,
  Rocket,
  PieChart as PieChartIcon
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { tasks, announcements, currentUser } = useAppStore();
  const teamMembers = getTeamMembers();
  const [query, setQuery] = useState('');

  const sendQuery = () => {
    if (query.trim()) {
      // In a real app, this would send to the team chat or leader directly
      alert('Query sent to team leader!');
      setQuery('');
    }
  };

  // Calculate project statistics
  const totalTasks = tasks.reduce((acc, task) => 
    acc + (task.subTasks?.length || 1), 0
  );
  
  const completedTasks = tasks.reduce((acc, task) => {
    if (task.subTasks) {
      return acc + task.subTasks.filter(st => st.status === 'Completed').length;
    }
    return acc + (task.status === 'Completed' ? 1 : 0);
  }, 0);

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusCounts = {
    'To Do': 0,
    'In Progress': 0,
    'Under Review': 0,
    'Blocked': 0,
    'Completed': 0,
  };

  tasks.forEach(task => {
    if (task.subTasks) {
      task.subTasks.forEach(subtask => {
        statusCounts[subtask.status]++;
      });
    } else {
      statusCounts[task.status]++;
    }
  });

  // Individual progress data
  const individualData = teamMembers.map(member => {
    const memberTasks = tasks.flatMap(task => 
      task.subTasks?.filter(st => st.assignedTo === member.id) || 
      (task.assignedTo === member.id ? [task] : [])
    );
    const completed = memberTasks.filter(t => t.status === 'Completed').length;
    const total = memberTasks.length;
    return {
      name: member.name.split(' ')[0],
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    };
  });

  // Get pending tasks for current user
  const pendingTasks = tasks.flatMap(task => 
    task.subTasks?.filter(st => st.status !== 'Completed' && st.assignedTo === currentUser?.id) || 
    (task.status !== 'Completed' && task.assignedTo === currentUser?.id ? [task] : [])
  ).slice(0, 5);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">Dashboard</h1>
            <p className="text-gray-400 text-xl">Welcome back to AgriSync-X project management</p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center text-sm text-gray-400">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Online
              </div>
              <div className="text-sm text-gray-400 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        <div className="widget-grid">
          {/* Overall Progress Widget */}
          <DashboardWidget
            title="Overall Project Progress"
            icon={<TrendingUp className="h-6 w-6 text-blue-400" />}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{overallProgress}%</span>
                  <p className="text-sm text-gray-400 mt-1 flex items-center">
                    <Rocket className="w-4 h-4 mr-1" />
                    Project Completion
                  </p>
                </div>
                <div className="w-24 h-24 relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeDasharray={`${overallProgress}, 100`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-300">{overallProgress}%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/30">
                  <p className="text-2xl font-bold text-green-400">{completedTasks}</p>
                  <p className="text-xs text-gray-300">Completed</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-500/30">
                  <p className="text-2xl font-bold text-blue-400">{totalTasks}</p>
                  <p className="text-xs text-gray-300">Total Tasks</p>
                </div>
              </div>
            </div>
          </DashboardWidget>

          {/* My Pending Tasks Widget */}
          <DashboardWidget
            title="My Pending Tasks"
            icon={<CheckCircle className="h-6 w-6 text-green-400" />}
          >
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/50 hover:bg-gray-700/50 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white text-sm truncate flex-1">
                      {task.title}
                    </h4>
                    <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{task.phase}</p>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${task.progress || 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{task.progress || 0}% complete</p>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">All caught up! No pending tasks.</p>
                </div>
              )}
            </div>
          </DashboardWidget>

          {/* Team Announcements Widget */}
          <DashboardWidget
            title="Team Announcements"
            icon={<AlertCircle className="h-6 w-6 text-orange-400" />}
          >
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement.id} className="relative pl-6 pb-4 border-l-2 border-blue-500/30 last:border-l-0 last:pb-0">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-800 shadow-lg"></div>
                  <div className="bg-gray-700/30 p-4 rounded-2xl border border-gray-600/30">
                    <h4 className="font-semibold text-white mb-2">
                      {announcement.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(announcement.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-sm text-gray-400">No announcements yet.</p>
                </div>
              )}
            </div>
          </DashboardWidget>

          {/* Quick Actions Widget */}
          <DashboardWidget
            title="Quick Actions"
            icon={<Zap className="h-6 w-6 text-yellow-400" />}
          >
            <div className="grid grid-cols-2 gap-4">
              <Link href="/tasks" className={`p-4 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}>
                <CheckCircle className="h-6 w-6 mb-2" />
                <p className="text-sm font-semibold">View Tasks</p>
              </Link>
              <Link href="/chat" className={`p-4 text-left bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}>
                <Users className="h-6 w-6 mb-2" />
                <p className="text-sm font-semibold">Team Chat</p>
              </Link>
              <Link href="/analytics" className={`p-4 text-left bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}>
                <BarChart3 className="h-6 w-6 mb-2" />
                <p className="text-sm font-semibold">Analytics</p>
              </Link>
              <Link href="/ai-assistant" className={`p-4 text-left bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}>
                <MessageSquare className="h-6 w-6 mb-2" />
                <p className="text-sm font-semibold">AI Assistant</p>
              </Link>
            </div>
          </DashboardWidget>

          {/* Task Status Breakdown Widget */}
          <DashboardWidget
            title="Task Status Breakdown"
            icon={<PieChartIcon className="h-6 w-6 text-purple-400" />}
          >
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      status === 'Completed' ? 'bg-green-500' :
                      status === 'In Progress' ? 'bg-blue-500' :
                      status === 'Under Review' ? 'bg-yellow-500' :
                      status === 'Blocked' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-300">{status}</span>
                  </div>
                  <span className="text-xl font-bold text-white">{count}</span>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Individual Progress Widget */}
          <DashboardWidget
            title="Individual Progress"
            icon={<Activity className="h-6 w-6 text-indigo-400" />}
          >
            <div className="space-y-4">
              {individualData.map(member => (
                <div key={member.name} className="space-y-3 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-300">{member.name}</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{member.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                      style={{ width: `${member.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{member.completed} completed</span>
                    <span>{member.total} total</span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardWidget>

          {/* Raise Query Widget */}
          <DashboardWidget
            title="Raise Query to Leader"
            icon={<Send className="h-6 w-6 text-blue-400" />}
          >
            <div className="space-y-4">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your question or concern here..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
              <button
                onClick={sendQuery}
                disabled={!query.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Leader
              </button>
            </div>
          </DashboardWidget>

          {/* Team Members Widget */}
          <DashboardWidget
            title="Team Members"
            icon={<Users className="h-6 w-6 text-cyan-400" />}
          >
            <div className="space-y-3">
              {teamMembers.map(member => (
                <div key={member.id} className="p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-sm text-gray-400">{member.role} ({member.specialization})</p>
                  </div>
                  {member.isLeader && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold ring-1 ring-inset ring-purple-500/30">Leader</span>
                  )}
                </div>
              ))}
            </div>
          </DashboardWidget>
        </div>
      </div>
    </Layout>
  );
}