"use client";

import React from 'react';
import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
          bg: 'bg-gradient-to-br from-red-900/50 to-red-950/50 border-red-800/50',
          iconBg: 'bg-red-500/20 text-red-400',
          icon: AlertTriangle,
          animation: 'animate-pulse-slow'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-emerald-900/50 to-emerald-950/50 border-emerald-800/50',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          icon: CheckCircle,
          animation: ''
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-br from-blue-900/50 to-blue-950/50 border-blue-800/50',
          iconBg: 'bg-blue-500/20 text-blue-400',
          icon: Lightbulb,
          animation: ''
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full rounded-2xl border p-5 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        style.bg
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl shrink-0 ring-1 ring-inset ring-white/10", style.iconBg)}>
          <Icon className={cn("w-6 h-6", type === 'warning' && "animate-pulse")} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1 leading-tight tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-gray-300 mb-3 leading-relaxed font-medium">
            {insight}
          </p>

          {/* Optional Data */}
          {data && (
            <div className="flex items-baseline gap-2 mt-2 pt-3 border-t border-white/10">
              <span className="text-xl font-bold text-white tracking-tight">
                {data.primary}
              </span>
              {data.secondary && (
                <span className="text-sm text-gray-400 font-medium">
                  {data.secondary}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
