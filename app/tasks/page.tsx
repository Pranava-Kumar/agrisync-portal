'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { useAppStore, getTeamMembers } from '@/lib/store';
import { getTaskExplanation } from '@/lib/gemini';
import { 
  ChevronDown, 
  ChevronRight, 
  Filter, 
  HelpCircle, 
  User,
  Calendar,
  BarChart,
  Plus,
  Trash2,
  X,
  Lock,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export default function TasksPage() {
  const { tasks, updateTask, deleteTask, addTask, currentUser } = useAppStore();
  const teamMembers = getTeamMembers();
  
  const [expandedTasks, setExpandedTasks] = useState<string[]>(['phase-1']);
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [explanationContent, setExplanationContent] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'To Do' as const,
    priority: 'Medium' as const,
    progress: 0,
    phase: 'Phase 1',
  });

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const canEditTask = (taskAssignedTo: string) => {
    return currentUser?.isLeader || currentUser?.id === taskAssignedTo;
  };

  const getExplanation = async (taskTitle: string, taskDescription: string, taskId: string) => {
    setShowExplanation(taskId);
    setLoadingExplanation(true);
    try {
      const explanation = await getTaskExplanation(taskTitle, taskDescription);
      setExplanationContent(explanation);
    } catch (error) {
      setExplanationContent('Failed to generate explanation. Please check your Gemini API key configuration and try again.');
    }
    setLoadingExplanation(false);
  };

  const handleStatusChange = (taskId: string, newStatus: string, taskAssignedTo: string) => {
    if (!canEditTask(taskAssignedTo)) return;
    
    const progressMap = {
      'To Do': 0,
      'In Progress': 50,
      'Under Review': 80,
      'Blocked': 0,
      'Completed': 100,
    };
    
    updateTask(taskId, { 
      status: newStatus as any, 
      progress: progressMap[newStatus as keyof typeof progressMap] 
    });
  };

  const handleProgressChange = (taskId: string, newProgress: number, taskAssignedTo: string) => {
    if (!canEditTask(taskAssignedTo)) return;
    
    let newStatus = 'To Do';
    if (newProgress > 0 && newProgress < 100) newStatus = 'In Progress';
    if (newProgress === 100) newStatus = 'Completed';
    
    updateTask(taskId, { 
      progress: newProgress,
      status: newStatus as any
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.assignedTo) return;
    
    addTask(newTask);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      status: 'To Do',
      priority: 'Medium',
      progress: 0,
      phase: 'Phase 1',
    });
    setShowAddTask(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'Under Review': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'Blocked': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/20 text-green-300 ring-green-500/30';
      case 'In Progress': return 'bg-blue-500/20 text-blue-300 ring-blue-500/30';
      case 'Under Review': return 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30';
      case 'Blocked': return 'bg-red-500/20 text-red-300 ring-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 ring-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesAssignee = filterAssignee === 'all' || task.assignedTo === filterAssignee;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesAssignee && matchesStatus;
  });

  // Calculate overall statistics
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">Project Tasks</h1>
              <p className="text-gray-400 text-lg">Complete NIDAR Competition workflow - {totalTasks} total tasks</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center text-sm text-gray-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  {completedTasks} Completed
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  {overallProgress}% Overall Progress
                </div>
              </div>
            </div>
            {currentUser?.isLeader && (
              <button
                onClick={() => setShowAddTask(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="dark-card p-6 mb-8">
          <div className="flex items-center space-x-6">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Assigned To
                </label>
                <select
                  value={filterAssignee}
                  onChange={(e) => setFilterAssignee(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Members</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-6">
          {filteredTasks.map(task => (
            <div key={task.id} className="dark-card">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <button
                      onClick={() => toggleExpanded(task.id)}
                      className="mt-1 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {expandedTasks.includes(task.id) ? (
                        <ChevronDown className="h-6 w-6" />
                      ) : (
                        <ChevronRight className="h-6 w-6" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                        {!canEditTask(task.assignedTo) && (
                          <span title="You can only edit your own tasks">
                            <Lock className="h-4 w-4 text-gray-500" />
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {teamMembers.find(m => m.id === task.assignedTo)?.name}
                        </div>
                        <div className="flex items-center">
                          <BarChart className="h-4 w-4 mr-2" />
                          {task.progress}% Complete
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </div>
                        {task.subTasks && (
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {task.subTasks.filter(st => st.status === 'Completed').length}/{task.subTasks.length} subtasks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => getExplanation(task.title, task.description, task.id)}
                      className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                      title="Get AI Explanation"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </button>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-300 w-12">
                        {task.progress}%
                      </span>
                    </div>
                    {currentUser?.isLeader && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress and Status Controls */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value, task.assignedTo)}
                      disabled={!canEditTask(task.assignedTo)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Blocked">Blocked</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Progress: {task.progress}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={task.progress}
                      onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value), task.assignedTo)}
                      disabled={!canEditTask(task.assignedTo)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Sub-tasks */}
                {expandedTasks.includes(task.id) && task.subTasks && (
                  <div className="mt-8 ml-8 space-y-4">
                    <h4 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2 text-blue-400" />
                      Sub-tasks ({task.subTasks.length})
                    </h4>
                    {task.subTasks.map(subtask => (
                      <div key={subtask.id} className="border-l-2 border-gray-600 pl-6 py-4 bg-gray-800/30 rounded-r-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h5 className="font-semibold text-gray-200">{subtask.title}</h5>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(subtask.status)}
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getStatusColor(subtask.status)}`}>
                                  {subtask.status}
                                </span>
                              </div>
                              {!canEditTask(subtask.assignedTo) && (
                                <span title="You can only edit your own tasks">
                                  <Lock className="h-3 w-3 text-gray-500" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-3">{subtask.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {teamMembers.find(m => m.id === subtask.assignedTo)?.name}
                              </span>
                              <span>{subtask.subPhase}</span>
                              <span className={getPriorityColor(subtask.priority)}>
                                {subtask.priority} Priority
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => getExplanation(subtask.title, subtask.description, subtask.id)}
                              className="text-blue-400 hover:text-blue-300 p-1 hover:bg-gray-700 rounded-lg transition-colors"
                              title="Get AI Explanation"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </button>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-700 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${subtask.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-300 w-8">
                                {subtask.progress}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Subtask Controls */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <select
                            value={subtask.status}
                            onChange={(e) => handleStatusChange(subtask.id, e.target.value, subtask.assignedTo)}
                            disabled={!canEditTask(subtask.assignedTo)}
                            className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Blocked">Blocked</option>
                            <option value="Completed">Completed</option>
                          </select>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={subtask.progress}
                            onChange={(e) => handleProgressChange(subtask.id, parseInt(e.target.value), subtask.assignedTo)}
                            disabled={!canEditTask(subtask.assignedTo)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        {showAddTask && currentUser?.isLeader && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">Add New Task</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter task description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Assigned To
                    </label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select team member...</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="input-field"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phase
                  </label>
                  <input
                    type="text"
                    value={newTask.phase}
                    onChange={(e) => setNewTask(prev => ({ ...prev, phase: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., Phase 1, Phase 2..."
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddTask}
                    disabled={!newTask.title.trim() || !newTask.assignedTo}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Task
                  </button>
                  <button
                    onClick={() => setShowAddTask(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Explanation Modal */}
        {showExplanation && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-gray-700/50 shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-semibold text-white flex items-center">
                    <HelpCircle className="h-6 w-6 mr-3 text-blue-400" />
                    AI Task Explanation
                  </h3>
                  <button
                    onClick={() => setShowExplanation(null)}
                    className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                {loadingExplanation ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-4 text-gray-300">Generating explanation...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {explanationContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}