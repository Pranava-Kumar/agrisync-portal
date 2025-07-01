'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore, getTeamMembers, User } from '@/lib/store';
import { Home, CheckSquare, FileText, Users, MessageCircle, Bot, BarChart3, Settings, X, Crown, Sparkles, LogOut, Bone as Drone } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, color: 'from-blue-500 to-blue-600' },
  { name: 'Project Tasks', href: '/tasks', icon: CheckSquare, color: 'from-green-500 to-emerald-600' },
  { name: 'Documents', href: '/documents', icon: FileText, color: 'from-purple-500 to-violet-600' },
  { name: 'Team', href: '/team', icon: Users, color: 'from-orange-500 to-red-600' },
  { name: 'Team Chat', href: '/chat', icon: MessageCircle, color: 'from-pink-500 to-rose-600' },
  { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, color: 'from-indigo-500 to-purple-600' },
  { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-teal-500 to-cyan-600' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useAppStore();
  
  const teamMembers = getTeamMembers();
  const isAdmin = currentUser?.isLeader || false;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onClose} />
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-72 bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 shadow-2xl">
            <SidebarContent 
              pathname={pathname} 
              currentUser={currentUser} 
              isAdmin={isAdmin}
              onClose={onClose}
              onLogout={handleLogout}
              showCloseButton
            />
          </nav>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <nav className="flex flex-col flex-grow bg-gray-800/95 backdrop-blur-lg border-r border-gray-700/50 shadow-xl">
          <SidebarContent 
            pathname={pathname} 
            currentUser={currentUser} 
            isAdmin={isAdmin}
            onLogout={handleLogout}
          />
        </nav>
      </div>
    </>
  );
}

interface SidebarContentProps {
  pathname: string;
  currentUser: User | null;
  isAdmin: boolean;
  onClose?: () => void;
  onLogout: () => void;
  showCloseButton?: boolean;
}

function SidebarContent({ pathname, currentUser, isAdmin, onClose, onLogout, showCloseButton }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between flex-shrink-0 responsive-p-6">
        <div className="flex items-center min-w-0 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
            <Drone className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="ml-3 md:ml-4 min-w-0 flex-1">
            <span className="responsive-text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AgriSync-X</span>
            <p className="responsive-text-xs text-gray-400 mt-0.5 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">NIDAR Competition</span>
            </p>
          </div>
        </div>
        {showCloseButton && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-700 rounded-lg flex-shrink-0">
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
      </div>
      
      <div className="responsive-p-6 py-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white responsive-text-sm font-bold">
              {currentUser?.name.split(' ').map((n: string) => n[0]).join('')}
            </span>
          </div>
          <div className="ml-3 md:ml-4 flex-1 min-w-0">
            <div className="flex items-center">
              <p className="responsive-text-sm font-semibold text-white text-wrap pr-2">{currentUser?.name}</p>
              {currentUser?.isLeader && (
                <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 flex-shrink-0" />
              )}
            </div>
            <p className="responsive-text-xs text-gray-400 text-wrap">{currentUser?.role}</p>
            <p className="responsive-text-xs text-gray-500 mt-1 text-wrap">ID: {currentUser?.id}</p>
          </div>
        </div>
        {currentUser?.isLeader && (
          <div className="mt-3 px-2 py-2 md:px-3 md:py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
            <div className="flex items-center">
              <Crown className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 mr-2 flex-shrink-0" />
              <span className="responsive-text-xs font-semibold text-yellow-300">Team Leader</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation with forced scrollbar */}
      <div className="flex-1 px-3 md:px-4 py-4 md:py-6 overflow-hidden">
        <div className="h-full overflow-y-scroll scrollbar-always space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center px-3 py-2 md:px-4 md:py-3 responsive-text-sm font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg
                  ${isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                  }
                `}
              >
                <item.icon
                  className={`mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            );
          })}
          
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-700">
              <Link
                href="/admin"
                onClick={onClose}
                className={`
                  group flex items-center px-3 py-2 md:px-4 md:py-3 responsive-text-sm font-medium rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg
                  ${pathname === '/admin'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white hover:shadow-md'
                  }
                `}
              >
                <Settings
                  className={`mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 flex-shrink-0 transition-colors ${
                    pathname === '/admin' ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                  }`}
                />
                <span className="truncate">Admin Panel</span>
                {pathname === '/admin' && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </Link>
            </div>
          )}
          
          {/* Add some padding at the bottom to ensure scrolling works */}
          <div className="h-20"></div>
        </div>
      </div>

      <div className="flex-shrink-0 px-3 md:px-4 py-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 md:px-4 md:py-3 responsive-text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-2xl transition-all duration-200"
        >
          <LogOut className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
        <div className="text-center mt-4">
          <p className="responsive-text-xs text-gray-500">AgriSync-X Portal v1.0</p>
          <p className="responsive-text-xs text-gray-600 mt-1">Precision Agriculture System</p>
        </div>
      </div>
    </div>
  );
}