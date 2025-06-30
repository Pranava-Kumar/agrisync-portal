'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { Send, Users, Crown, Smile, Paperclip, MoreVertical } from 'lucide-react';

export default function ChatPage() {
  const { currentUser, chatMessages, addChatMessage, clearChat } = useAppStore();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    addChatMessage({
      userId: currentUser.id,
      userName: currentUser.name,
      message: newMessage.trim(),
    });

    setNewMessage('');
    
    // Simulate typing indicator for demo
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return minutes <= 1 ? 'Just now' : `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUserColor = (userId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-emerald-600', 
      'from-purple-500 to-violet-600',
      'from-orange-500 to-red-600',
      'from-pink-500 to-rose-600',
    ];
    // Simple hash function to consistently assign colors
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getOnlineMembers = () => {
    // In a real application, you would track online status via Firestore presence
    // For now, we'll consider all registered users as 'online' for display purposes.
    return useAppStore.getState().registeredUsers;
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] mobile-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 responsive-gap-6 h-full">
          {/* Online Members Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="dark-card h-full max-h-96 lg:max-h-full">
              <div className="responsive-p-6 border-b border-gray-700">
                <h3 className="responsive-text-lg font-semibold text-white flex items-center">
                  <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-400" />
                  <span className="hidden sm:inline">Online Members</span>
                  <span className="sm:hidden">Online</span>
                </h3>
                <p className="responsive-text-sm text-gray-400 mt-1">{getOnlineMembers().length} online</p>
              </div>
              <div className="p-3 md:p-4 scrollable-container scrollable-sm lg:scrollable-lg space-y-3">
                {getOnlineMembers().map(member => (
                  <div key={member.id} className="flex items-center space-x-3 p-2 md:p-3 rounded-xl hover:bg-gray-700/30 transition-colors">
                    <div className="relative">
                      <div className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r ${getUserColor(member.id)} rounded-full flex items-center justify-center`}>
                        <span className="text-white responsive-text-xs font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-gray-800 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="responsive-text-sm font-medium text-white truncate">{member.name}</p>
                        {member.isLeader && (
                          <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 ml-1 flex-shrink-0" />
                        )}
                      </div>
                      <p className="responsive-text-xs text-green-400">Online</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="dark-card h-full flex flex-col">
              {/* Header */}
              <div className="responsive-p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="responsive-text-2xl font-semibold text-white">Team Chat</h1>
                    <p className="responsive-text-sm text-gray-400">Real-time team communication</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentUser?.isLeader && (
                      <button
                        onClick={clearChat}
                        className="text-gray-400 hover:text-gray-200 p-2 hover:bg-gray-700 rounded-xl transition-colors"
                        title="Clear chat history"
                      >
                        <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                      </button>
                    )}
                    <div className="flex items-center responsive-text-sm text-gray-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="hidden sm:inline">{getOnlineMembers().length} online</span>
                      <span className="sm:hidden">{getOnlineMembers().length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollable-container responsive-p-6 space-y-4 md:space-y-6">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
                    </div>
                    <h3 className="responsive-text-xl font-semibold text-gray-300 mb-2">Start the conversation</h3>
                    <p className="text-gray-500 responsive-text-sm">Send your first message to get the team discussion going!</p>
                  </div>
                ) : (
                  chatMessages.map(message => {
                    const isCurrentUser = message.userId === currentUser?.id;
                    
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 md:space-x-3 max-w-xs sm:max-w-sm md:max-w-2xl ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-white responsive-text-sm font-medium bg-gradient-to-r ${getUserColor(message.userId)} shadow-lg flex-shrink-0`}>
                            {message.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 md:px-6 md:py-4 shadow-lg ${
                            isCurrentUser 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                              : 'bg-gray-700/50 text-gray-100 border border-gray-600/50'
                          }`}>
                            {!isCurrentUser && (
                              <div className="flex items-center space-x-2 mb-2">
                                <p className="responsive-text-xs font-semibold text-gray-300">
                                  {message.userName}
                                </p>
                                {message.userName === 'Pranava Kumar' && (
                                  <Crown className="h-3 w-3 text-yellow-400" />
                                )}
                              </div>
                            )}
                            <p className="responsive-text-sm leading-relaxed text-wrap">{message.message}</p>
                            <p className={`responsive-text-xs mt-2 ${
                              isCurrentUser ? 'text-blue-100' : 'text-gray-400'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-gray-600 flex items-center justify-center">
                        <span className="text-white responsive-text-sm">...</span>
                      </div>
                      <div className="bg-gray-700/50 rounded-2xl px-4 py-3 md:px-6 md:py-4 border border-gray-600/50">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="responsive-p-6 border-t border-gray-700">
                <div className="flex space-x-3 md:space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 md:px-6 md:py-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10 md:pr-12 responsive-text-sm"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1"
                    >
                      <Smile className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center responsive-btn"
                  >
                    <Send className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
                <p className="responsive-text-xs text-gray-500 mt-2">
                  Press Enter to send • Messages are synced in real-time
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}