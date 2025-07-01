'use client';

import Layout from '@/components/Layout';
import { useAppStore, getTeamMembers } from '@/lib/store';
import { Crown, User, Users as UsersIcon, Target } from 'lucide-react';

export default function TeamPage() {
  const { currentUser } = useAppStore();
  const teamMembers = getTeamMembers();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-3">Team</h1>
          <p className="text-gray-400 text-lg">Meet the AgriSync-X development team</p>
        </div>

        {/* Current User Info */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-300">You are currently signed in as</p>
              <p className="text-lg font-semibold text-white flex items-center">
                {currentUser?.name}
                {currentUser?.isLeader && <Crown className="h-5 w-5 text-yellow-400 ml-2" />}
              </p>
              <p className="text-xs text-blue-200">User ID: {currentUser?.id}</p>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teamMembers.map(member => (
            <div key={member.id} className="dark-card hover-lift overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                      {member.isLeader && (
                        <span title="Team Leader">
                          <Crown className="h-5 w-5 text-yellow-400 ml-2" />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-blue-300 font-medium">{member.specialization}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-200 mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-purple-400" />
                    Role & Responsibilities
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{member.role}</p>
                </div>

                {member.isLeader && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                      <span className="text-sm font-semibold text-yellow-300">Team Leader</span>
                    </div>
                    <p className="text-xs text-yellow-200">
                      Responsible for overall project coordination and team management
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Member since</span>
                    <span className="text-gray-300">Jan 2024</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Statistics */}
        <div className="dark-card p-8">
          <h3 className="text-2xl font-semibold text-white mb-8 flex items-center">
            <UsersIcon className="h-6 w-6 mr-3 text-blue-400" />
            Team Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl border border-blue-500/30">
              <div className="text-4xl font-bold text-blue-400 mb-2">{teamMembers.length}</div>
              <div className="text-sm text-gray-300 font-medium">Total Members</div>
              <div className="text-xs text-gray-500 mt-1">Active contributors</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {teamMembers.filter(m => m.isLeader).length}
              </div>
              <div className="text-sm text-gray-300 font-medium">Team Leaders</div>
              <div className="text-xs text-gray-500 mt-1">Project coordinators</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl border border-purple-500/30">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {new Set(teamMembers.map(m => m.specialization)).size}
              </div>
              <div className="text-sm text-gray-300 font-medium">Specializations</div>
              <div className="text-xs text-gray-500 mt-1">Technical domains</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl border border-orange-500/30">
              <div className="text-4xl font-bold text-orange-400 mb-2">7</div>
              <div className="text-sm text-gray-300 font-medium">Project Phases</div>
              <div className="text-xs text-gray-500 mt-1">Development stages</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}