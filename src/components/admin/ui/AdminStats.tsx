import React from 'react';
import { LucideIcon } from 'lucide-react';
import { AdminCard } from './AdminCard';

interface StatItem {
  label: string;
  value: number | string;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

interface AdminStatsProps {
  stats: StatItem[];
  className?: string;
}

export function AdminStats({ stats, className = '' }: AdminStatsProps) {
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-400 bg-blue-500/20';
      case 'green':
        return 'text-green-400 bg-green-500/20';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'red':
        return 'text-red-400 bg-red-500/20';
      case 'purple':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getChangeColor = (change?: number) => {
    if (!change) return 'text-gray-400';
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(stats.length, 4)} gap-6 ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);
        
        return (
          <AdminCard key={index} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                {(stat.change !== undefined || stat.changeLabel) && (
                  <div className="flex items-center text-sm">
                    {stat.change !== undefined && (
                      <span className={`font-medium ${getChangeColor(stat.change)}`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}
                      </span>
                    )}
                    {stat.changeLabel && (
                      <span className="text-gray-400 ml-1">
                        {stat.changeLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${colorClasses}`}>
                <Icon className="h-7 w-7" />
              </div>
            </div>
          </AdminCard>
        );
      })}
    </div>
  );
}