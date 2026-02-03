import { z } from "zod";

// Types
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: "expense" | "income";
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

// Fixed Categories
export const CATEGORIES = [
  "Dining",
  "Groceries",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Health",
  "Rent",
  "Income",
] as const;

// Colors for categories
export const CATEGORY_COLORS: Record<string, string> = {
  Dining: "#F59E0B", // Amber
  Groceries: "#10B981", // Emerald
  Transport: "#3B82F6", // Blue
  Entertainment: "#8B5CF6", // Purple
  Shopping: "#EC4899", // Pink
  Bills: "#64748B", // Slate
  Health: "#EF4444", // Red
  Rent: "#6366F1", // Indigo
  Income: "#22C55E", // Green
};

// 45-50 Realistic Transactions for January 2026
// Helper to get date string relative to today
const getRelativeDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Realistic Transactions relative to "Today"
export const transactions: Transaction[] = [
  // Income
  {
    id: "t1",
    date: getRelativeDate(28), // Last monthish
    amount: 3500,
    category: "Income",
    description: "Monthly Salary",
    type: "income",
  },
  {
    id: "t39",
    date: getRelativeDate(12),
    amount: 200.0,
    category: "Income",
    description: "Freelance Gig",
    type: "income",
  },

  // Fixed Expenses (1st of this month-ish)
  {
    id: "t2",
    date: getRelativeDate(30),
    amount: 1200,
    category: "Rent",
    description: "Rent Payment",
    type: "expense",
  },
  
  // Recent / This Week
  {
    id: "t6",
    date: getRelativeDate(1), // Yesterday
    amount: 124.5,
    category: "Groceries",
    description: "Weekly Groceries at Whole Foods",
    type: "expense",
  },
  {
    id: "t14",
    date: getRelativeDate(2),
    amount: 65.0,
    category: "Dining",
    description: "Dinner with friends",
    type: "expense",
  },
  {
    id: "t23",
    date: getRelativeDate(3),
    amount: 35.0,
    category: "Transport",
    description: "Weekly Fuel",
    type: "expense",
  },
  
  // Last Week
  {
    id: "t7",
    date: getRelativeDate(8),
    amount: 42.3,
    category: "Groceries",
    description: "Quick Mart Run",
    type: "expense",
  },
  {
    id: "t32",
    date: getRelativeDate(9),
    amount: 85.0,
    category: "Shopping",
    description: "New Running Shoes",
    type: "expense",
  },
  {
    id: "t29",
    date: getRelativeDate(10),
    amount: 35.0,
    category: "Entertainment",
    description: "Cinema Tickets",
    type: "expense",
  },
  
  // 2 Weeks Ago
  {
    id: "t8",
    date: getRelativeDate(15),
    amount: 156.2,
    category: "Groceries",
    description: "Bulk Grocery Haul",
    type: "expense",
  },
  {
    id: "t18",
    date: getRelativeDate(16),
    amount: 45.2,
    category: "Dining",
    description: "Lunch with Colleagues",
    type: "expense",
  },
  
  // Older
  {
    id: "t9",
    date: getRelativeDate(22),
    amount: 35.15,
    category: "Groceries",
    description: "Fresh Produce",
    type: "expense",
  },
  {
    id: "t34",
    date: getRelativeDate(25),
    amount: 120.0,
    category: "Shopping",
    description: "Winter Jacket",
    type: "expense",
  },
   {
    id: "t20",
    date: getRelativeDate(5),
    amount: 32.0,
    category: "Dining",
    description: "Takeout Pizza",
    type: "expense",
  },
  {
    id: "t44",
    date: getRelativeDate(0), // Today
    amount: 15.50,
    category: "Dining",
    description: "Lunch Special",
    type: "expense",
  }
];

// Budgets
export let budgets: Budget[] = [
  { category: "Dining", limit: 500, spent: 0, color: CATEGORY_COLORS.Dining },
  {
    category: "Groceries",
    limit: 600,
    spent: 0,
    color: CATEGORY_COLORS.Groceries,
  },
  {
    category: "Transport",
    limit: 200,
    spent: 0,
    color: CATEGORY_COLORS.Transport,
  },
  {
    category: "Entertainment",
    limit: 150,
    spent: 0,
    color: CATEGORY_COLORS.Entertainment,
  },
  {
    category: "Shopping",
    limit: 300,
    spent: 0,
    color: CATEGORY_COLORS.Shopping,
  },
  { category: "Bills", limit: 300, spent: 0, color: CATEGORY_COLORS.Bills },
];

export const savingsGoals: SavingsGoal[] = [
  {
    id: "sg1",
    name: "Europe Trip",
    target: 3000,
    current: 1200,
    deadline: "2026-06-01",
  },
  {
    id: "sg2",
    name: "Emergency Fund",
    target: 10000,
    current: 4500,
    deadline: "2026-12-31",
  },
  {
    id: "sg3",
    name: "New Laptop",
    target: 2000,
    current: 800,
    deadline: "2026-03-01",
  },
];

// --- Helper Functions ---

// Initialize budgets with actual spending from transaction data
function initializeBudgets() {
  const spending = getSpendingByCategory();
  budgets = budgets.map((b) => {
    const categorySpend = spending.find((s) => s.name === b.category);
    return {
      ...b,
      spent: categorySpend ? categorySpend.value : 0,
    };
  });
}

export function getTransactionsByCategory(category: string): Transaction[] {
  return transactions.filter((t) => t.category === category);
}

export function getTransactionsByDateRange(
  start: string,
  end: string,
): Transaction[] {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return transactions.filter((t) => {
    const d = new Date(t.date);
    return d >= startDate && d <= endDate;
  });
}

export function calculateCategorySpending(
  category: string,
  dateRange?: { start: string; end: string },
): number {
  let txs = getTransactionsByCategory(category).filter(
    (t) => t.type === "expense",
  );
  if (dateRange) {
    txs = txs.filter((t) => {
      const d = new Date(t.date);
      return d >= new Date(dateRange.start) && d <= new Date(dateRange.end);
    });
  }
  return txs.reduce((sum, t) => sum + t.amount, 0);
}

export function getSpendingByCategory(): {
  name: string;
  value: number;
  color: string;
}[] {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || "#9CA3AF",
  }));
}

export function getTotalIncome(): number {
  return transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(): number {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getRecentTransactions(limit: number): Transaction[] {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

// Initialize on load
initializeBudgets();
