"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, TrendingUp } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

export interface SpendingChartProps {
  title: string;
  data: { name: string; value: number; color?: string }[];
  type: 'bar' | 'line' | 'pie';
  showTotal?: boolean;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 border border-gray-700 p-2 rounded-lg shadow-xl">
        <p className="text-gray-400 text-xs mb-1">{label || payload[0].name}</p>
        <p className="text-white font-bold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

import { motion } from 'framer-motion';

// ... (imports remain the same, just adding motion)
// Note: I cannot see the imports in the replacement chunk, assuming I need to add it or it's already there if I replace the whole file. 
// Actually I should replace the component implementation to wrap it in motion.div

export default function SpendingChart({ 
  title, 
  data, 
  type, 
  showTotal = true,
  height = 300 
}: SpendingChartProps) {
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = total / (data.length || 1);
  const highest = Math.max(...data.map(d => d.value), 0);

  const getSubtitle = () => {
    if (type === 'bar') return 'Comparison by Category';
    if (type === 'line') return 'Spending Trend';
    return 'Distribution Breakdown';
  };

  const getIcon = () => {
    if (type === 'bar') return <BarChartIcon className="w-5 h-5 text-emerald-500" />;
    if (type === 'line') return <TrendingUp className="w-5 h-5 text-blue-500" />;
    return <PieChartIcon className="w-5 h-5 text-purple-500" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            {getIcon()}
            {getSubtitle()}
          </p>
        </div>
        {showTotal && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-right bg-gray-900/50 p-3 rounded-xl border border-gray-700/50"
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(total)}</p>
          </motion.div>
        )}
      </div>

      {/* Chart Area */}
      <div style={{ height }} className="w-full relative min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#374151', opacity: 0.2 }} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#1F2937' }}
                activeDot={{ r: 8, fill: '#60A5FA' }}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      {type !== 'pie' && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-700/50">
          <div>
            <p className="text-xs text-gray-500">Average</p>
            <p className="text-sm font-semibold text-gray-300">{formatCurrency(average)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Highest</p>
            <p className="text-sm font-semibold text-gray-300">{formatCurrency(highest)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-sm font-semibold text-gray-300">{data.length}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
