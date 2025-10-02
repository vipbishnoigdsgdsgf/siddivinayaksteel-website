import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function AdminCard({ 
  title, 
  subtitle, 
  children, 
  className = '',
  headerActions 
}: AdminCardProps) {
  return (
    <Card className={`bg-dark-200 border-gray-800 ${className}`}>
      {(title || headerActions) && (
        <CardHeader className="border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <CardTitle className="text-white text-lg font-semibold">
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
              )}
            </div>
            {headerActions && (
              <div className="flex items-center space-x-2">
                {headerActions}
              </div>
            )}
          </div>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}