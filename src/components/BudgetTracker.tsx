"use client";

import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export interface BudgetTrackerProps {
  budgets: Budget[];
  title?: string;
}

export default function BudgetTracker({ 
  budgets, 
  title = "Budget Status" 
}: BudgetTrackerProps) {

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const getStatus = (spent: number, limit: number) => {
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    if (percentage > 100) return { 
      status: '⚠️ Over', 
      color: 'text-[#EF4444]', 
      bg: 'bg-[#EF4444]', 
      bgLight: 'bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2]',
      border: 'border-[#EF4444]/30', 
      icon: AlertCircle 
    };
    if (percentage > 85) return { 
      status: '⚠ Watch', 
      color: 'text-[#F59E0B]', 
      bg: 'bg-[#F59E0B]', 
      bgLight: 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]',
      border: 'border-[#F59E0B]/30', 
      icon: AlertCircle 
    };
    return { 
      status: '✓ Good', 
      color: 'text-[#22C55E]', 
      bg: 'bg-[#22C55E]', 
      bgLight: 'bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]',
      border: 'border-[#22C55E]/30', 
      icon: CheckCircle 
    };
  };

  return (
    <div className="w-full space-y-6">
      {/* Overall Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#FFF4F0] to-[#FFE8DD] border-2 border-[#FF6B35]/20 rounded-3xl p-6 shadow-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#2D1B0E] flex items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
              {title}
            </h2>
            <div className="text-right">
              <span className="block text-2xl font-bold text-[#2D1B0E] tracking-tight">
                {formatCurrency(totalSpent)}
              </span>
              <span className="text-xs text-[#7A6152] font-medium uppercase tracking-wider">
                of {formatCurrency(totalBudget)} Budget
              </span>
            </div>
          </div>
          <div className="h-4 bg-white rounded-full overflow-hidden border-2 border-[#E8DED2]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#FF6B35] via-[#F59E0B] to-[#22C55E]"
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[#9B8477]">0%</span>
            <span className="text-xs text-[#5C4534] font-medium">
              {Math.round(totalPercentage)}% Used
            </span>
            <span className="text-xs text-[#9B8477]">100%</span>
          </div>
        </div>
      </motion.div>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => {
          const { status, color, bg, bgLight, border, icon: Icon } = getStatus(budget.spent, budget.limit);
          const percentage = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
          const remaining = budget.limit - budget.spent;

          return (
            <motion.div 
              key={budget.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "group bg-white backdrop-blur-sm border-2 md:hover:scale-[1.02] hover:shadow-lg transition-all duration-300 rounded-2xl p-5 relative overflow-hidden",
                border
              )}
            >
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: budget.color, backgroundColor: budget.color }}
                  />
                  <h3 className="font-semibold text-[#2D1B0E]">{budget.category}</h3>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2", bgLight, border)}>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider", color)}>
                    {status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 relative z-10">
                <div className="flex justify-between text-sm items-end">
                  <span className="text-2xl font-bold text-[#2D1B0E] tracking-tighter">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-xs text-[#9B8477] mb-1">
                    / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <div className="h-2 bg-[#FFF4E6] rounded-full overflow-hidden border border-[#E8DED2]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.05) }}
                    className={cn("h-full", bg)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs relative z-10">
                <span className={remaining < 0 ? "text-[#EF4444] font-medium" : "text-[#22C55E] font-medium"}>
                  {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over limit` : `${formatCurrency(remaining)} remaining`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-white rounded-2xl border-2 border-[#E8DED2]">
        <span className="text-xs text-[#9B8477]">Monthly Reset: 1st of month</span>
        <span className="text-xs text-[#9B8477]">{budgets.length} Categories Tracked</span>
      </div>
    </div>
  );
}
