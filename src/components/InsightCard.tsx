"use client";

import React from 'react';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
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
          bg: 'bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]',
          border: 'border-[#EF4444]/30',
          iconBg: 'bg-[#EF4444]/10',
          iconColor: 'text-[#EF4444]',
          icon: AlertTriangle,
          textColor: 'text-[#2D1B0E]',
          secondaryColor: 'text-[#7A6152]'
        };
      case 'success':
        return {
          bg: 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]',
          border: 'border-[#22C55E]/30',
          iconBg: 'bg-[#22C55E]/10',
          iconColor: 'text-[#22C55E]',
          icon: CheckCircle,
          textColor: 'text-[#2D1B0E]',
          secondaryColor: 'text-[#7A6152]'
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]',
          border: 'border-[#3B82F6]/30',
          iconBg: 'bg-[#3B82F6]/10',
          iconColor: 'text-[#3B82F6]',
          icon: Lightbulb,
          textColor: 'text-[#2D1B0E]',
          secondaryColor: 'text-[#7A6152]'
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
        "w-full rounded-2xl border-2 p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        style.bg,
        style.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("p-3 rounded-xl shrink-0", style.iconBg)}>
          <Icon className={cn("w-6 h-6", style.iconColor, type === 'warning' && "animate-pulse")} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={cn("text-lg font-bold mb-1 leading-tight tracking-tight", style.textColor)} style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {title}
          </h3>
          <p className={cn("text-sm mb-3 leading-relaxed font-medium", style.secondaryColor)}>
            {insight}
          </p>

          {/* Optional Data */}
          {data && (
            <div className="flex items-baseline gap-2 mt-2 pt-3 border-t-2 border-white/50">
              <span className={cn("text-xl font-bold tracking-tight", style.textColor)}>
                {data.primary}
              </span>
              {data.secondary && (
                <span className={cn("text-sm font-medium", style.secondaryColor)}>
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
