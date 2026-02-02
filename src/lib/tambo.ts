import { z } from "zod";
import { type TamboComponent } from "@tambo-ai/react";

// Components
import SpendingChart from "@/components/SpendingChart";
import BudgetTracker from "@/components/BudgetTracker";
import TransactionList from "@/components/TransactionList";
import InsightCard from "@/components/InsightCard";

// Mock Data APIs
import {
  transactions,
  budgets,
  savingsGoals,
  getTransactionsByCategory,
  getTransactionsByDateRange,
  calculateCategorySpending,
  getSpendingByCategory,
  getTotalIncome,
  getTotalExpenses,
  getRecentTransactions,
  CATEGORY_COLORS
} from "@/lib/mockData";
import { formatCurrency } from "./utils";

// --- Component Schemas ---

const spendingChartSchema = z.object({
  title: z.string().describe("Title of the chart").nullish(),
  data: z.array(z.object({
    name: z.string().catch('Unknown'),
    value: z.number().catch(0),
    color: z.string().nullish()
  })).describe("Data points for the chart").catch([]),
  type: z.enum(['bar', 'line', 'pie']).describe("Type of chart to render").catch('bar'),
  showTotal: z.boolean().optional(),
  height: z.number().optional()
});

const budgetTrackerSchema = z.object({
  budgets: z.array(z.object({
    category: z.string().catch('Uncategorized'),
    limit: z.number().catch(0),
    spent: z.number().catch(0),
    color: z.string().catch('#3B82F6')
  })).describe("List of budgets to track").catch([]),
  title: z.string().nullish()
});

const transactionListSchema = z.object({
  transactions: z.array(z.object({
    id: z.string().catch('unknown'),
    date: z.string().catch(new Date().toISOString()),
    amount: z.number().catch(0),
    category: z.string().catch('Uncategorized'),
    description: z.string().catch('No description'),
    type: z.string().catch('expense')
  })).describe("List of transactions to display").catch([]),
  title: z.string().nullish(),
  limit: z.number().optional()
});

const insightCardSchema = z.object({
  title: z.string().nullish(),
  insight: z.string().describe("The insight text").nullish(),
  type: z.enum(['warning', 'success', 'info']).catch('info'),
  data: z.object({
    primary: z.string().catch(''),
    secondary: z.string().nullish()
  }).optional()
});


// --- Component Registration ---

export const components: TamboComponent[] = [
  {
    name: "SpendingChart",
    description: `Versatile chart for visualizing financial data.
    - Use 'bar' type for comparing categories side-by-side
    - Use 'line' type for showing trends over time (dates on x-axis)
    - Use 'pie' type for showing distribution/breakdown (percentage view)
    Perfect for questions like "show me spending", "compare categories", "spending trends".
    ALWAYS provide a descriptive title.`,
    component: SpendingChart,
    propsSchema: spendingChartSchema,
  },
  {
    name: "BudgetTracker",
    description: `Visualizes budget limits vs actual spending.
    Use this when the user asks about:
    - Budget status ("Am I over budget?")
    - Spending limits
    - Category health
    Shows progress bars and warning indicators.`,
    component: BudgetTracker,
    propsSchema: budgetTrackerSchema,
  },
  {
    name: "TransactionList",
    description: `Displays a list of specific transactions.
    Use this when looking for:
    - Recent activity ("What did I buy recently?")
    - Specific category items ("Show my dining expenses")
    - Income vs Expense history
    Shows date, description, category, and amount.`,
    component: TransactionList,
    propsSchema: transactionListSchema,
  },
  {
    name: "InsightCard",
    description: `Displays a single, high-impact insight with visual feedback.
    Use for:
    - Warnings ("You are over budget on X")
    - Success messages ("You met your savings goal")
    - Actionable tips ("You could save $X by cutting Y")
    Can be rendered multiple times for multiple insights.`,
    component: InsightCard,
    propsSchema: insightCardSchema,
  }
];


// --- Tool Registration ---

// --- Helper Functions for Tools ---

async function getBudgetStatusHelper() {
  const spending = getSpendingByCategory();
  return budgets.map(b => {
    const categorySpend = spending.find(s => s.name === b.category);
    return {
      ...b,
      spent: categorySpend ? categorySpend.value : 0
    };
  });
}

async function getFinancialSummaryHelper() {
  const income = getTotalIncome();
  const expenses = getTotalExpenses();
  return {
    income,
    expenses,
    netSavings: income - expenses,
    savingsRate: ((income - expenses) / income) * 100
  };
}

import { defineTool } from "@tambo-ai/react";

// ... (previous imports)

export const tools = [
  defineTool({
    name: "get_all_transactions",
    description: "Returns all available transactions from the database.",
    tool: async () => {
      return transactions;
    },
  }),
  defineTool({
    name: "get_transactions_by_category",
    description: "Filters transactions by a specific category (e.g., 'Dining', 'Groceries').",
    inputSchema: z.object({ category: z.string() }),
    tool: async ({ category }) => {
      return getTransactionsByCategory(category);
    },
  }),
  defineTool({
    name: "get_transactions_by_date_range",
    description: "Get transactions available within a specific date range (start to end, inclusive).",
    inputSchema: z.object({ start: z.string(), end: z.string() }),
    tool: async ({ start, end }) => {
      return getTransactionsByDateRange(start, end);
    },
  }),
  defineTool({
    name: "calculate_category_spending",
    description: "Calculates the total spending for a specific category within an optional date range.",
    inputSchema: z.object({ 
      category: z.string(), 
      dateRange: z.object({ start: z.string(), end: z.string() }).optional() 
    }),
    tool: async ({ category, dateRange }) => {
      return { 
        category: category,
        total: calculateCategorySpending(category, dateRange) 
      };
    },
  }),
  defineTool({
    name: "get_spending_by_category",
    description: "Returns a breakdown of total spending by category, useful for charts.",
    tool: async () => {
      return getSpendingByCategory();
    },
  }),
  defineTool({
    name: "get_budget_status",
    description: "Returns the current status of all budgets, including limits, spent amounts, and remaining funds.",
    tool: async () => {
      return getBudgetStatusHelper();
    },
  }),
  defineTool({
    name: "get_total_income",
    description: "Returns the total income recorded.",
    tool: async () => {
      return { totalIncome: getTotalIncome() };
    },
  }),
  defineTool({
    name: "get_total_expenses",
    description: "Returns the total expenses recorded.",
    tool: async () => {
      return { totalExpenses: getTotalExpenses() };
    },
  }),
  defineTool({
    name: "get_recent_transactions",
    description: "Returns the N most recent transactions.",
    inputSchema: z.object({ limit: z.number().default(5) }),
    tool: async ({ limit }) => {
      return getRecentTransactions(limit);
    },
  }),
  defineTool({
    name: "get_financial_summary",
    description: "Returns a high-level summary including total income, total expenses, and net savings.",
    tool: async () => {
      return getFinancialSummaryHelper();
    },
  }),
  defineTool({
    name: "generate_spending_insights",
    description: "Analyzes financial data to generate actionable insights and warnings, suitable for display with InsightCards.",
    tool: async () => {
      const insights = [];
      const status = await getBudgetStatusHelper();
      
      const warnings = status.filter(b => b.spent > b.limit);
      for (const w of warnings) {
        insights.push({
          title: `Over Budget: ${w.category}`,
          insight: `You have exceeded your ${w.category} budget by ${formatCurrency(w.spent - w.limit)}.`,
          type: 'warning',
          data: { primary: formatCurrency(w.spent - w.limit) + " over" }
        });
      }

      const warningsNear = status.filter(b => b.spent <= b.limit && b.spent > b.limit * 0.85);
      for (const w of warningsNear) {
        insights.push({
          title: `Near Limit: ${w.category}`,
          insight: `You are at ${Math.round((w.spent / w.limit) * 100)}% of your ${w.category} budget.`,
          type: 'warning',
          data: { primary: formatCurrency(w.limit - w.spent) + " left" }
        });
      }

      const { income, expenses } = await getFinancialSummaryHelper();
      if (income > expenses) {
        insights.push({
          title: "Net Positive",
          insight: "You're spending less than you earn this month. Great job!",
          type: 'success',
          data: { primary: formatCurrency(income - expenses) + " saved" }
        });
      }

      return insights;
    }
  }),
  defineTool({
    name: "update_budget_limit",
    description: "Updates the budget limit for a specific category.",
    inputSchema: z.object({ category: z.string(), newLimit: z.number() }),
    tool: async ({ category, newLimit }) => {
      const budget = budgets.find(b => b.category === category);
      if (budget) {
        budget.limit = newLimit;
        return { success: true, message: `Updated ${category} budget to ${formatCurrency(newLimit)}`, budget };
      }
      return { success: false, message: `Category ${category} not found.` };
    }
  }),
];
