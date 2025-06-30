'use client';

import { useState, useRef, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAppStore } from '@/lib/store';
import { getChatResponse } from '@/lib/gemini';
import { Bot, User, Send, Lightbulb, Sparkles, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
}

const suggestedQuestions = [
  "How should we approach the crop stress detection algorithm?",
  "What are the key challenges in dual-drone coordination?",
  "Best practices for RTK GPS integration in drones?",
  "How to optimize flight patterns for precision agriculture?",
  "What sensors are best for crop health monitoring?",
  "How to implement real-time data transmission between drones?",
];

export default function AIAssistantPage() {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `Hello ${currentUser?.name}! I'm your AI assistant for the AgriSync-X project. I'm powered by Gemini 2.0 Flash and I can help with technical questions about drone development, project management, competition preparation, and more. How can I assist you today?`,
      isAI: true,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatResponse(content, `AgriSync-X drone competition project. Current user: ${currentUser?.name} (${currentUser?.role})`);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isAI: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble processing your request right now. Please check that your Gemini API key is configured correctly in the .env file and try again.',
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
        <div className="dark-card h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-semibold text-white flex items-center">
                  AI Assistant
                  <Sparkles className="h-5 w-5 ml-2 text-yellow-400" />
                </h1>
                <p className="text-sm text-gray-400">Powered by Gemini 2.0 Flash • Your intelligent project companion</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-3 max-w-4xl ${
                  message.isAI ? '' : 'flex-row-reverse space-x-reverse'
                }`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.isAI 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {message.isAI ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-6 py-4 shadow-lg ${
                    message.isAI 
                      ? 'bg-gray-700/50 text-gray-100 border border-gray-600/50' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <p className={`text-xs mt-3 ${
                      message.isAI ? 'text-gray-400' : 'text-blue-100'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gray-700/50 rounded-2xl px-6 py-4 border border-gray-600/50">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="p-6 border-t border-gray-700 bg-gray-800/30">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">Suggested questions:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(question)}
                    className="text-left p-4 text-sm text-blue-300 hover:text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <Zap className="h-4 w-4 inline mr-2" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-6 border-t border-gray-700">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about the AgriSync-X project..."
                disabled={isLoading}
                className="flex-1 input-field disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Ask about drone development, project management, or technical challenges
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}