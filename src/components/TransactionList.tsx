"use client";

import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Calendar, Tag, ChevronDown, ListFilter } from 'lucide-react';
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

// Map categories to icons/colors (using generic logic if not matched)
const getCategoryStyle = (category: string) => {
  const styles: Record<string, string> = {
    Dining: 'bg-amber-500/10 text-amber-500',
    Groceries: 'bg-emerald-500/10 text-emerald-500',
    Transport: 'bg-blue-500/10 text-blue-500',
    Entertainment: 'bg-purple-500/10 text-purple-500',
    Shopping: 'bg-pink-500/10 text-pink-500',
    Bills: 'bg-slate-500/10 text-slate-400',
    Health: 'bg-red-500/10 text-red-500',
    Income: 'bg-green-500/10 text-green-500'
  };
  return styles[category] || 'bg-gray-700 text-gray-400';
};

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
    <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg animate-in fade-in duration-500">
      <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="bg-gray-800 p-2 rounded-lg">
            <ListFilter className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <span className="text-xs text-gray-500 font-mono bg-gray-950 px-2 py-1 rounded">
          {transactions.length} items
        </span>
      </div>

      {!transactions.length ? (
        <div className="p-12 text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <ListFilter className="w-8 h-8 opacity-50" />
          </div>
          <p>No transactions found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950/50 text-gray-400 font-medium uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {visibleTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-800/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 tabular-nums">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 text-gray-200 font-medium">
                      {t.description}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", getCategoryStyle(t.category))}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className={cn("flex items-center justify-end font-bold", t.type === 'income' ? 'text-emerald-400' : 'text-gray-200')}>
                        {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                        {t.type === 'income' ? (
                          <ArrowDownLeft className="w-4 h-4 ml-1 text-emerald-500/50" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 ml-1 text-gray-500/50" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-800">
            {visibleTransactions.map((t) => (
              <div key={t.id} className="p-4 hover:bg-gray-800/30 active:bg-gray-800/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-gray-200 font-medium line-clamp-1">{t.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={10} /> {formatDate(t.date)}
                      </span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full", getCategoryStyle(t.category))}>
                        {t.category}
                      </span>
                    </div>
                  </div>
                  <span className={cn("font-bold", t.type === 'income' ? 'text-emerald-400' : 'text-white')}>
                    {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Limit */}
          {hasMore && (
            <div className="p-4 bg-gray-900/50 border-t border-gray-800 text-center">
              <button
                onClick={() => setDisplayCount(prev => prev + 10)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                Load more transactions
                <ChevronDown size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
