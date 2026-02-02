"use client";

import React from 'react';
import { AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

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
  const totalPercentage = Math.min((totalSpent / totalBudget) * 100, 100);

  const getStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage > 90) return { status: 'critical', color: 'text-red-500', bg: 'bg-red-500', icon: AlertCircle };
    if (percentage > 70) return { status: 'warning', color: 'text-amber-500', bg: 'bg-amber-500', icon: AlertCircle };
    return { status: 'good', color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle };
  };

  return (
    <div className="w-full space-y-6">
      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <span className="text-sm text-gray-400">
            {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
          </span>
        </div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${totalPercentage}%` }}
          />
        </div>
        <p className="text-right text-xs text-gray-500 mt-2">
          {Math.round(totalPercentage)}% of total budget used
        </p>
      </div>

      {/* Grid of Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget) => {
          const { status, color, bg, icon: Icon } = getStatus(budget.spent, budget.limit);
          const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
          const remaining = budget.limit - budget.spent;

          return (
            <div 
              key={budget.category}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ color: budget.color, backgroundColor: budget.color }}
                  />
                  <h3 className="font-semibold text-gray-200">{budget.category}</h3>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-800/50", color)}>
                  <Icon size={14} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {status === 'good' ? 'On Track' : status}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Spent: <span className="text-white">{formatCurrency(budget.spent)}</span></span>
                  <span className="text-gray-500">Limit: {formatCurrency(budget.limit)}</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000 ease-out", bg)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className={remaining < 0 ? "text-red-400" : "text-gray-400"}>
                  {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
                </span>
                
                {/* Visual Edit Hint */}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                  <Edit2 size={12} />
                </button>
              </div>
            </div>
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
