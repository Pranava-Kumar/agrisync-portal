'use client';

import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Users, Target, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const { tasks, chatMessages } = useAppStore();

  console.log("Tasks from store:", tasks);
  console.log("Chat messages from store:", chatMessages);

  // Calculate project statistics from real data
  const allTasks = tasks.flatMap(task => task.subTasks && task.subTasks.length > 0 ? task.subTasks : [task]);

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'Completed').length;

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statusCounts = allTasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<Task['status'], number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  const teamMembers = useAppStore(state => state.registeredUsers);

  const individualData = teamMembers.map(member => {
    const memberTasks = allTasks.filter(t => t.assignedTo === member.id);
    const completed = memberTasks.filter(t => t.status === 'Completed').length;
    const total = memberTasks.length;
    return {
      name: member.name.split(' ')[0],
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total,
    };
  });

  const getTimeSeriesData = () => {
    const completedTasksWithDates = allTasks.filter(t => t.status === 'Completed');

    const weeklyData: { week: string, tasks: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const tasksInWeek = completedTasksWithDates.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= weekStart && taskDate < weekEnd;
      }).length;

      weeklyData.push({
        week: `Week ${6 - i}`,
        tasks: tasksInWeek,
      });
    }

    return weeklyData;
  };

  const timeSeriesData = getTimeSeriesData();

  const phaseData = tasks.map(phase => {
    const phaseTasks = allTasks.filter(t => t.phase === phase.phase);
    const completed = phaseTasks.filter(t => t.status === 'Completed').length;
    const total = phaseTasks.length;
    return {
      name: phase.title.replace('Phase ', 'P').substring(0, 15) + '...',
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // Communication activity from real chat data
  const communicationData = teamMembers.map(member => {
    const memberMessages = chatMessages.filter(msg => msg.userId === member.id);
    return {
      name: member.name.split(' ')[0],
      messages: memberMessages.length,
    };
  });

  console.log("Individual Data:", individualData);
  console.log("Time Series Data:", timeSeriesData);
  console.log("Communication Data:", communicationData);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">Analytics</h1>
          <p className="text-gray-400 text-lg">Real-time project insights and progress visualization</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="dark-card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Overall Progress</p>
                <p className="text-3xl font-bold text-blue-400">{overallProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="dark-card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Completed Tasks</p>
                <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="dark-card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-300">{totalTasks}</p>
              </div>
              <div className="w-12 h-12 bg-gray-500/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
          
          <div className="dark-card p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400">Team Messages</p>
                <p className="text-3xl font-bold text-purple-400">{chatMessages.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Status Breakdown */}
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <PieChartIcon className="h-6 w-6 mr-3 text-blue-400" />
              Task Status Breakdown
            </h3>
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChartIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p>No task data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Individual Progress */}
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Users className="h-6 w-6 mr-3 text-green-400" />
              Individual Progress
            </h3>
            {individualData.some(item => item.total > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={individualData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, 'Progress']}
                    labelFormatter={(label) => `Team Member: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="progress" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                  <p>No individual progress data available</p>
                </div>
              </div>
            )}
          </div>

          {/* Task Completion Over Time */}
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-3 text-purple-400" />
              Task Completion Rate Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Communication Activity */}
          <div className="dark-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-orange-400" />
              Communication Activity
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={communicationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" />
                <YAxis dataKey="name" type="category" width={80} stroke="#9CA3AF" />
                <Tooltip 
                  formatter={(value) => [`${value}`, 'Messages']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                />
                <Bar dataKey="messages" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 dark-card p-8">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Target className="h-6 w-6 mr-3 text-indigo-400" />
            Project Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl border border-blue-500/30">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {totalTasks > 0 ? Math.round((statusCounts['In Progress'] / totalTasks) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-300 font-medium">Tasks In Progress</p>
              <p className="text-xs text-gray-500 mt-1">Active development work</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {totalTasks > 0 ? Math.round(((statusCounts['Completed'] + statusCounts['In Progress']) / totalTasks) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-300 font-medium">Tasks Started</p>
              <p className="text-xs text-gray-500 mt-1">Work begun or finished</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl border border-orange-500/30">
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {statusCounts['Blocked']}
              </div>
              <p className="text-sm text-gray-300 font-medium">Blocked Tasks</p>
              <p className="text-xs text-gray-500 mt-1">Requiring attention</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}