"use client";

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Calendar, ListFilter, ChevronDown } from 'lucide-react';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'expense' | 'income';
}

export interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  limit?: number;
}

// Map categories to warm colors
const getCategoryStyle = (category: string) => {
  const styles: Record<string, string> = {
    Dining: 'bg-[#FEF3C7] text-[#F59E0B] border-[#F59E0B]/20',
    Groceries: 'bg-[#DCFCE7] text-[#22C55E] border-[#22C55E]/20',
    Transport: 'bg-[#DBEAFE] text-[#3B82F6] border-[#3B82F6]/20',
    Entertainment: 'bg-[#F3E8FF] text-[#A855F7] border-[#A855F7]/20',
    Shopping: 'bg-[#FCE7F3] text-[#EC4899] border-[#EC4899]/20',
    Bills: 'bg-[#F5EDE4] text-[#7A6152] border-[#7A6152]/20',
    Health: 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]/20',
    Income: 'bg-[#DCFCE7] text-[#22C55E] border-[#22C55E]/20'
  };
  return styles[category] || 'bg-[#FFF4E6] text-[#9B8477] border-[#E8DED2]';
};

import { motion } from 'framer-motion';

export default function TransactionList({ 
  transactions, 
  title = "Recent Transactions",
  limit = 10 
}: TransactionListProps) {
  const [displayCount, setDisplayCount] = useState(limit);
  
  // Sort by date descending
  const sortedTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  const visibleTransactions = sortedTransactions.slice(0, displayCount);
  const hasMore = displayCount < sortedTransactions.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white border-2 border-[#E8DED2] rounded-3xl overflow-hidden shadow-lg"
    >
      <div className="px-6 py-5 border-b-2 border-[#E8DED2] flex justify-between items-center bg-gradient-to-r from-[#FFF8F0] to-[#FFF4E6]">
        <div className="flex items-center gap-3">
          <div className="bg-[#FFF4F0] border-2 border-[#FFE8DD] p-2 rounded-lg">
            <ListFilter className="w-5 h-5 text-[#FF6B35]" />
          </div>
          <h2 className="text-lg font-bold text-[#2D1B0E]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{title}</h2>
        </div>
        <span className="text-xs text-[#7A6152] font-mono bg-white px-2 py-1 rounded border border-[#E8DED2]">
          {transactions.length} items
        </span>
      </div>

      {!transactions.length ? (
        <div className="p-16 text-center text-[#9B8477] flex flex-col items-center">
          <div className="w-20 h-20 bg-[#FFF4E6] rounded-full flex items-center justify-center mb-4 border-2 border-[#E8DED2]">
            <ListFilter className="w-10 h-10 opacity-30" />
          </div>
          <h3 className="text-[#2D1B0E] font-medium mb-1">No transactions found</h3>
          <p className="text-sm text-[#9B8477]">Try adjusting your filters or date range.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-[#FFF8F0] to-[#FFF4E6] text-[#7A6152] font-medium uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4 pl-8">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right pr-8">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED2]">
                {visibleTransactions.map((t, index) => (
                  <motion.tr 
                    key={t.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#FFF8F0] transition-colors group cursor-default"
                  >
                    <td className="px-6 py-4 pl-8 whitespace-nowrap text-[#7A6152] tabular-nums">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 text-[#5C4534] font-medium group-hover:text-[#2D1B0E] transition-colors">
                      {t.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-2 transition-all", getCategoryStyle(t.category))}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 pr-8 text-right whitespace-nowrap">
                      <div className={cn("flex items-center justify-end font-bold", t.type === 'income' ? 'text-[#22C55E]' : 'text-[#2D1B0E]')}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        {t.type === 'income' ? (
                          <ArrowDownLeft className="w-4 h-4 ml-1 text-[#22C55E]/50" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 ml-1 text-[#9B8477]/50" />
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-[#E8DED2]">
            {visibleTransactions.map((t, index) => (
              <motion.div 
                key={t.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-[#FFF8F0] active:bg-[#FFF4E6] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[#5C4534] font-medium line-clamp-1">{t.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#9B8477] flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(t.date)}
                      </span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", getCategoryStyle(t.category))}>
                        {t.category}
                      </span>
                    </div>
                  </div>
                  <span className={cn("font-bold", t.type === 'income' ? 'text-[#22C55E]' : 'text-[#2D1B0E]')}>
                    {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="p-4 bg-gradient-to-r from-[#FFF8F0] to-[#FFF4E6] border-t-2 border-[#E8DED2] text-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 10)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#7A6152] hover:text-[#2D1B0E] hover:bg-white rounded-lg border-2 border-[#E8DED2] transition-all"
              >
                Load more transactions
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
