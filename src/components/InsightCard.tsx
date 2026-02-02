"use client";

import React from 'react';
import { AlertCircle, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InsightCardProps {
  title: string;
  insight: string;
  type: 'warning' | 'success' | 'info';
  data?: {
    primary: string;
    secondary?: string;
  };
}

export default function InsightCard({
  title,
  insight,
  type,
  data
}: InsightCardProps) {
  
  const getStyle = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-gradient-to-br from-red-900/40 to-red-950/40 border-red-900/50',
          iconBg: 'bg-red-500/20 text-red-500',
          icon: AlertCircle,
          animation: 'animate-pulse'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-emerald-900/40 to-emerald-950/40 border-emerald-900/50',
          iconBg: 'bg-emerald-500/20 text-emerald-500',
          icon: CheckCircle,
          animation: ''
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-900/40 to-blue-950/40 border-blue-900/50',
          iconBg: 'bg-blue-500/20 text-blue-500',
          icon: Lightbulb,
          animation: ''
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className={cn(
      "w-full rounded-2xl border p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]",
      style.bg
    )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl shrink-0", style.iconBg)}>
          <Icon className={cn("w-6 h-6", type === 'warning' && "animate-pulse")} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed">
            {insight}
          </p>

          {/* Optional Data */}
          {data && (
            <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-white/10">
              <span className="text-xl font-bold text-white tracking-tight">
                {data.primary}
              </span>
              {data.secondary && (
                <span className="text-sm text-gray-400">
                  {data.secondary}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
