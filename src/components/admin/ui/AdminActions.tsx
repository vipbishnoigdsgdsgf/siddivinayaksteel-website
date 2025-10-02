import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { AdminCard } from './AdminCard';

interface AdminAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: boolean;
  count?: number;
}

interface AdminActionsProps {
  title: string;
  subtitle?: string;
  actions: AdminAction[];
  className?: string;
}

export function AdminActions({ title, subtitle, actions, className = '' }: AdminActionsProps) {
  const getVariantClasses = (variant?: string) => {
    switch (variant) {
      case 'destructive':
        return 'border-red-600 text-red-400 hover:bg-red-600 hover:text-white';
      case 'outline':
        return 'border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white';
      case 'secondary':
        return 'border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white';
      default:
        return 'border-steel text-white hover:bg-steel hover:text-white';
    }
  };

  return (
    <AdminCard title={title} subtitle={subtitle} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={index}
              variant="outline"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`relative flex items-center justify-center p-4 h-auto ${getVariantClasses(action.variant)} transition-all duration-200`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{action.label}</span>
                {action.count !== undefined && action.count > 0 && (
                  <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {action.count > 99 ? '99+' : action.count}
                  </span>
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </AdminCard>
  );
}