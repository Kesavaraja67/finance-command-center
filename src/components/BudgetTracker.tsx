"use client";

import React from 'react';
import { AlertCircle, CheckCircle, Edit2, TrendingUp } from 'lucide-react';
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
    if (percentage > 100) return { status: 'Over Budget', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500/50', icon: AlertCircle };
    if (percentage > 85) return { status: 'Warning', color: 'text-amber-400', bg: 'bg-amber-500', border: 'border-amber-500/50', icon: AlertCircle };
    return { status: 'On Track', color: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50', icon: CheckCircle };
  };

  return (
    <div className="w-full space-y-6">
      {/* Overall Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              {title}
            </h2>
            <div className="text-right">
              <span className="block text-2xl font-bold text-white tracking-tight">
                {formatCurrency(totalSpent)}
              </span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                of {formatCurrency(totalBudget)} Budget
              </span>
            </div>
          </div>
          <div className="h-4 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${totalPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-400 font-medium">
              {Math.round(totalPercentage)}% Used
            </span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </motion.div>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => {
          const { status, color, bg, border, icon: Icon } = getStatus(budget.spent, budget.limit);
          const percentage = budget.limit > 0 ? Math.min((budget.spent / budget.limit) * 100, 100) : 0;
          const remaining = budget.limit - budget.spent;

          return (
            <motion.div 
              key={budget.category}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "group bg-gray-900/50 backdrop-blur-sm border md:hover:scale-[1.02] hover:shadow-lg transition-all duration-300 rounded-xl p-5 relative overflow-hidden",
                "border-gray-800 hover:border-gray-600"
              )}
            >
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: budget.color, backgroundColor: budget.color }}
                  />
                  <h3 className="font-semibold text-gray-100">{budget.category}</h3>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-950/50 border border-white/5", color)}>
                  <Icon size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4 relative z-10">
                <div className="flex justify-between text-sm items-end">
                  <span className="text-2xl font-bold text-white tracking-tighter">
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-xs text-gray-500 mb-1">
                    / {formatCurrency(budget.limit)}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.05) }}
                    className={cn("h-full", bg)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs relative z-10">
                <span className={remaining < 0 ? "text-red-400 font-medium" : "text-emerald-400 font-medium"}>
                  {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over limit` : `${formatCurrency(remaining)} remaining`}
                </span>
                
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                  <Edit2 size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900/30 rounded-lg border border-gray-800/50">
        <span className="text-xs text-gray-500">Monthly Reset: 1st of month</span>
        <span className="text-xs text-gray-500">{budgets.length} Categories Tracked</span>
      </div>
    </div>
  );
}
