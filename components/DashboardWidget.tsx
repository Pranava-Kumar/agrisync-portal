'use client';

import { ReactNode } from 'react';

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export default function DashboardWidget({ 
  title, 
  children, 
  className = '',
  icon 
}: DashboardWidgetProps) {
  return (
    <div className={`dark-card hover-lift ${className}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center">
          {icon && (
            <div className="mr-3 p-3 bg-gray-700/30 rounded-2xl">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}