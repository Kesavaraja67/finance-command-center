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
import { formatCurrency } from '@/lib/utils';

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
      <div className="bg-white border-2 border-[#E8DED2] p-3 rounded-xl shadow-xl">
        <p className="text-[#7A6152] text-xs mb-1">{label || payload[0].name}</p>
        <p className="text-[#2D1B0E] font-bold text-sm">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart({ 
  title, 
  data, 
  type, 
  showTotal = true,
  height = 300 
}: SpendingChartProps) {
  
  // Validate and sanitize data
  const validData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
    
    return data.map(item => ({
      name: item.name || 'Unknown',
      value: typeof item.value === 'number' && !isNaN(item.value) ? item.value : 0,
      color: item.color || '#FF6B35'
    })).filter(item => item.value > 0); // Only show items with positive values
  }, [data]);

  const total = validData.reduce((sum, item) => sum + item.value, 0);
  const average = total / (validData.length || 1);
  const highest = Math.max(...validData.map(d => d.value), 0);

  const getSubtitle = () => {
    if (type === 'bar') return 'Comparison by Category';
    if (type === 'line') return 'Spending Trend';
    return 'Distribution Breakdown';
  };

  const getIcon = () => {
    if (type === 'bar') return <BarChartIcon className="w-5 h-5 text-[#FF6B35]" />;
    if (type === 'line') return <TrendingUp className="w-5 h-5 text-[#3B82F6]" />;
    return <PieChartIcon className="w-5 h-5 text-[#22C55E]" />;
  };

  // Show empty state if no valid data
  if (validData.length === 0) {
    return (
      <div className="w-full bg-white border-2 border-[#E8DED2] rounded-3xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-[#2D1B0E] mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
        <div className="flex items-center justify-center h-64 text-[#9B8477]">
          <p>No data available to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-2 border-[#E8DED2] rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#2D1B0E] mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
          <p className="text-sm text-[#7A6152] flex items-center gap-2">
            {getIcon()}
            {getSubtitle()}
          </p>
        </div>
        {showTotal && (
          <div className="text-right bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] p-3 rounded-2xl border-2 border-[#22C55E]/20">
            <p className="text-xs text-[#7A6152] uppercase tracking-wider">Total</p>
            <p className="text-xl font-bold text-[#22C55E]">{formatCurrency(total)}</p>
          </div>
        )}
      </div>

      {/* Chart Area */}
      <div style={{ height: `${height}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={validData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DED2" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#7A6152" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#7A6152" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#FFF4E6', opacity: 0.3 }} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                animationDuration={800}
                animationBegin={0}
              >
                {validData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={validData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DED2" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#7A6152" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#7A6152" 
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
                dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#FFFFFF' }}
                activeDot={{ r: 8, fill: '#60A5FA' }}
                animationDuration={800}
                animationBegin={0}
              />
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={validData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                animationDuration={800}
                animationBegin={0}
                label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                labelLine={{ stroke: '#7A6152' }}
              >
                {validData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      {type !== 'pie' && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t-2 border-[#E8DED2]">
          <div>
            <p className="text-xs text-[#9B8477]">Average</p>
            <p className="text-sm font-semibold text-[#5C4534]">{formatCurrency(average)}</p>
          </div>
          <div>
            <p className="text-xs text-[#9B8477]">Highest</p>
            <p className="text-sm font-semibold text-[#5C4534]">{formatCurrency(highest)}</p>
          </div>
          <div>
            <p className="text-xs text-[#9B8477]">Items</p>
            <p className="text-sm font-semibold text-[#5C4534]">{validData.length}</p>
          </div>
        </div>
      )}
    </div>
  );
}
