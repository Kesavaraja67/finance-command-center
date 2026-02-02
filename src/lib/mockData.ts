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
export const transactions: Transaction[] = [
  // Income
  {
    id: "t1",
    date: "2026-01-01",
    amount: 3500,
    category: "Income",
    description: "Monthly Salary",
    type: "income",
  },

  // Fixed Expenses
  {
    id: "t2",
    date: "2026-01-01",
    amount: 1200,
    category: "Rent",
    description: "January Rent",
    type: "expense",
  },
  {
    id: "t3",
    date: "2026-01-01",
    amount: 150,
    category: "Bills",
    description: "Electricity Bill",
    type: "expense",
  },
  {
    id: "t4",
    date: "2026-01-01",
    amount: 80,
    category: "Bills",
    description: "Internet Subscription",
    type: "expense",
  },
  {
    id: "t5",
    date: "2026-01-05",
    amount: 45,
    category: "Bills",
    description: "Mobile Plan",
    type: "expense",
  },

  // Groceries (Regular ~every 3-4 days)
  {
    id: "t6",
    date: "2026-01-03",
    amount: 124.5,
    category: "Groceries",
    description: "Weekly Groceries at Whole Foods",
    type: "expense",
  },
  {
    id: "t7",
    date: "2026-01-07",
    amount: 42.3,
    category: "Groceries",
    description: "Quick Mart Run",
    type: "expense",
  },
  {
    id: "t8",
    date: "2026-01-10",
    amount: 156.2,
    category: "Groceries",
    description: "Bulk Grocery Haul",
    type: "expense",
  },
  {
    id: "t9",
    date: "2026-01-14",
    amount: 35.15,
    category: "Groceries",
    description: "Fresh Produce",
    type: "expense",
  },
  {
    id: "t10",
    date: "2026-01-18",
    amount: 98.4,
    category: "Groceries",
    description: "Weekly Essentials",
    type: "expense",
  },
  {
    id: "t11",
    date: "2026-01-22",
    amount: 55.6,
    category: "Groceries",
    description: "Snacks and Beverages",
    type: "expense",
  },
  {
    id: "t12",
    date: "2026-01-25",
    amount: 130.75,
    category: "Groceries",
    description: "Costco Run",
    type: "expense",
  },
  {
    id: "t13",
    date: "2026-01-29",
    amount: 28.9,
    category: "Groceries",
    description: "Milk and Bread",
    type: "expense",
  },

  // Dining (Weekends heavy)
  {
    id: "t14",
    date: "2026-01-02",
    amount: 65.0,
    category: "Dining",
    description: "Dinner with friends",
    type: "expense",
  },
  {
    id: "t15",
    date: "2026-01-04",
    amount: 24.5,
    category: "Dining",
    description: "Sunday Brunch",
    type: "expense",
  },
  {
    id: "t16",
    date: "2026-01-09",
    amount: 88.0,
    category: "Dining",
    description: "Date Night at Sushi Place",
    type: "expense",
  },
  {
    id: "t17",
    date: "2026-01-11",
    amount: 15.4,
    category: "Dining",
    description: "Coffee and Bagel",
    type: "expense",
  },
  {
    id: "t18",
    date: "2026-01-16",
    amount: 45.2,
    category: "Dining",
    description: "Lunch with Colleagues",
    type: "expense",
  },
  {
    id: "t19",
    date: "2026-01-17",
    amount: 92.5,
    category: "Dining",
    description: "Italian Dinner",
    type: "expense",
  },
  {
    id: "t20",
    date: "2026-01-23",
    amount: 32.0,
    category: "Dining",
    description: "Takeout Pizza",
    type: "expense",
  },
  {
    id: "t21",
    date: "2026-01-24",
    amount: 75.8,
    category: "Dining",
    description: "Steakhouse Dinner",
    type: "expense",
  },
  {
    id: "t22",
    date: "2026-01-30",
    amount: 18.9,
    category: "Dining",
    description: "Food Truck Lunch",
    type: "expense",
  },

  // Transport
  {
    id: "t23",
    date: "2026-01-02",
    amount: 35.0,
    category: "Transport",
    description: "Weekly Fuel",
    type: "expense",
  },
  {
    id: "t24",
    date: "2026-01-08",
    amount: 12.5,
    category: "Transport",
    description: "Uber Ride",
    type: "expense",
  },
  {
    id: "t25",
    date: "2026-01-15",
    amount: 38.0,
    category: "Transport",
    description: "Fuel Refill",
    type: "expense",
  },
  {
    id: "t26",
    date: "2026-01-20",
    amount: 15.0,
    category: "Transport",
    description: "Train Ticket",
    type: "expense",
  },
  {
    id: "t27",
    date: "2026-01-28",
    amount: 42.0,
    category: "Transport",
    description: "Full Tank Gas",
    type: "expense",
  },

  // Entertainment
  {
    id: "t28",
    date: "2026-01-03",
    amount: 14.99,
    category: "Entertainment",
    description: "Netflix Subscription",
    type: "expense",
  },
  {
    id: "t29",
    date: "2026-01-10",
    amount: 35.0,
    category: "Entertainment",
    description: "Cinema Tickets",
    type: "expense",
  },
  {
    id: "t30",
    date: "2026-01-21",
    amount: 59.99,
    category: "Entertainment",
    description: "Video Game Purchase",
    type: "expense",
  },
  {
    id: "t31",
    date: "2026-01-25",
    amount: 9.99,
    category: "Entertainment",
    description: "Spotify Premium",
    type: "expense",
  },

  // Shopping
  {
    id: "t32",
    date: "2026-01-06",
    amount: 85.0,
    category: "Shopping",
    description: "New Running Shoes",
    type: "expense",
  },
  {
    id: "t33",
    date: "2026-01-19",
    amount: 45.0,
    category: "Shopping",
    description: "Birthday Gift for Mom",
    type: "expense",
  },
  {
    id: "t34",
    date: "2026-01-27",
    amount: 120.0,
    category: "Shopping",
    description: "Winter Jacket",
    type: "expense",
  },

  // Health
  {
    id: "t35",
    date: "2026-01-12",
    amount: 50.0,
    category: "Health",
    description: "Gym Membership",
    type: "expense",
  },
  {
    id: "t36",
    date: "2026-01-26",
    amount: 35.0,
    category: "Health",
    description: "Pharmacy Vitamins",
    type: "expense",
  },

  // Miscellaneous
  {
    id: "t37",
    date: "2026-01-09",
    amount: 25.0,
    category: "Bills",
    description: "Water Bill",
    type: "expense",
  },
  {
    id: "t38",
    date: "2026-01-14",
    amount: 10.0,
    category: "Shopping",
    description: "Stationery",
    type: "expense",
  },
  {
    id: "t39",
    date: "2026-01-11",
    amount: 200.0,
    category: "Income",
    description: "Freelance Gig",
    type: "income",
  }, // Extra income
  {
    id: "t40",
    date: "2026-01-31",
    amount: 50.0,
    category: "Entertainment",
    description: "Concert Ticket deposit",
    type: "expense",
  },
  {
    id: "t41",
    date: "2026-01-05",
    amount: 12.0,
    category: "Dining",
    description: "Coffee",
    type: "expense",
  },
  {
    id: "t42",
    date: "2026-01-13",
    amount: 8.5,
    category: "Dining",
    description: "Sandwich",
    type: "expense",
  },
  {
    id: "t43",
    date: "2026-01-22",
    amount: 18.0,
    category: "Transport",
    description: "Taxi home",
    type: "expense",
  },
  {
    id: "t44",
    date: "2026-01-29",
    amount: 110.0,
    category: "Shopping",
    description: "Home Decor",
    type: "expense",
  },
  {
    id: "t45",
    date: "2026-01-15",
    amount: 60.0,
    category: "Health",
    description: "Dental Checkup Co-pay",
    type: "expense",
  },
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
