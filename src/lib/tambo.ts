import { z } from "zod";
import { type TamboComponent, withInteractable, defineTool } from "@tambo-ai/react";

// Components
import SpendingChart from "@/components/SpendingChart";
import BudgetTracker from "@/components/BudgetTracker";
import TransactionList from "@/components/TransactionList";
import InsightCard from "@/components/InsightCard";

// Mock Data APIs
import {
  transactions,
  budgets as mockBudgets,
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
import { getBudgets, updateBudgetLimit } from "./budgetStore";

// --- Component Schemas ---

const spendingChartSchema = z.object({
  title: z.string().describe("Title of the chart").nullish(),
  data: z.array(z.object({
    name: z.string().catch('Unknown'),
    value: z.number().catch(0),
    color: z.string().nullish()
  })).describe("Data points for the chart").catch([]),
  type: z.enum(['bar', 'line', 'pie']).describe("Type of chart to render").catch('bar'),
  showTotal: z.boolean().catch(true),
  height: z.number().nullish()
});

// Single budget item schema for re-use
const budgetItemSchema = z.object({
  category: z.string().catch('Uncategorized'),
  limit: z.number().catch(0),
  spent: z.number().catch(0),
  color: z.string().catch('#3B82F6')
});

const budgetTrackerSchema = z.object({
  budgets: z.array(budgetItemSchema).describe("List of budgets to track").catch([]),
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
  limit: z.number().nullish()
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

const InteractableBudgetTracker = withInteractable(BudgetTracker, {
  componentName: "BudgetTracker",
  description: "Budget tracker that persists and can be updated through conversation",
  propsSchema: budgetTrackerSchema,
});

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
    description: "Shows budget status. Updates when user changes budget limits.",
    component: InteractableBudgetTracker,
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
    CRITICAL: When the 'generate_spending_insights' tool returns a list of insights, you MUST render one InsightCard for EACH item in that list.
    Use for:
    - Warnings ("You are over budget on X")
    - Success messages ("You met your savings goal")
    - Actionable tips ("You could save $X by cutting Y")
    `,
    component: InsightCard,
    propsSchema: insightCardSchema,
  }
];


// --- Tool Registration ---

// --- Helper Functions for Tools ---

async function getBudgetStatusHelper() {
  const spending = getSpendingByCategory();
  const currentBudgets = getBudgets(); // Use store
  return currentBudgets.map(b => {
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
    description: "Analyze spending patterns and generate actionable insights",
    tool: async () => {
      const insights = [];
      const budgets = await getBudgetStatusHelper(); // Use helper to get current status with spending
      
      // Check budget warnings
      budgets.forEach(budget => {
        // Safe check for limit > 0
        if (budget.limit > 0) {
          const percentage = (budget.spent / budget.limit) * 100;
          if (percentage > 90) {
            insights.push({
              title: `${budget.category} Budget Alert`,
              insight: `You've spent ${percentage.toFixed(0)}% of your ${budget.category} budget. Consider reducing spending in this category.`,
              type: 'warning',
              data: {
                primary: `$${(budget.limit - budget.spent).toFixed(2)} remaining`,
                secondary: `$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}`
              }
            });
          }
        }
      });
      
      // Calculate savings rate
      const income = getTotalIncome();
      const expenses = getTotalExpenses();
      const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
      
      if (savingsRate < 10) {
        insights.push({
          title: "Low Savings Rate",
          insight: `You're only saving ${savingsRate.toFixed(1)}% of your income. Financial experts recommend 20% or higher.`,
          type: 'warning',
          data: {
            primary: `$${(income - expenses).toFixed(2)} saved this month`,
          }
        });
      } else if (savingsRate > 20) {
        insights.push({
          title: "Great Savings Rate!",
          insight: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the excellent work!`,
          type: 'success',
          data: {
            primary: `$${(income - expenses).toFixed(2)} saved this month`,
          }
        });
      }
      
      // Check for unusual spending
      const categorySpending = getSpendingByCategory();
      if (categorySpending.length > 0) {
        const avgSpending = categorySpending.reduce((sum, c) => sum + c.value, 0) / categorySpending.length;
        
        categorySpending.forEach(cat => {
          if (cat.value > avgSpending * 1.5) {
            insights.push({
              title: `High ${cat.name} Spending`,
              insight: `Your ${cat.name} spending is significantly higher than your average category spending.`,
              type: 'info',
              data: {
                primary: `$${cat.value.toFixed(2)} spent`,
                secondary: `${((cat.value / avgSpending - 1) * 100).toFixed(0)}% above average`
              }
            });
          }
        });
      }
      
      return insights.length > 0 ? insights : [{
        title: "All Good!",
        insight: "Your spending looks healthy. Keep monitoring your budgets regularly.",
        type: 'success',
        data: { primary: "No issues detected" }
      }];
    },
    outputSchema: z.array(insightCardSchema),
  }),
  defineTool({
    name: "compare_spending_periods",
    description: "Compare spending between two time periods (e.g., this month vs last month)",
    tool: async (params: { period1Start: string; period1End: string; period2Start: string; period2End: string }) => {
      const period1 = getTransactionsByDateRange(params.period1Start, params.period1End);
      const period2 = getTransactionsByDateRange(params.period2Start, params.period2End);
      
      const period1Total = period1.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const period2Total = period2.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      
      const change = period2Total > 0 ? ((period1Total - period2Total) / period2Total) * 100 : 0;
      
      return {
        period1: { start: params.period1Start, end: params.period1End, total: period1Total },
        period2: { start: params.period2Start, end: params.period2End, total: period2Total },
        change: change,
        direction: change > 0 ? 'increased' : 'decreased'
      };
    },
    inputSchema: z.object({
      period1Start: z.string(),
      period1End: z.string(),
      period2Start: z.string(),
      period2End: z.string(),
    }),
    outputSchema: z.object({
      period1: z.object({ start: z.string(), end: z.string(), total: z.number() }),
      period2: z.object({ start: z.string(), end: z.string(), total: z.number() }),
      change: z.number(),
      direction: z.enum(['increased', 'decreased']),
    }),
  }),
  defineTool({
    name: "update_budget_limit",
    description: "Update the spending limit for a category. Use when user says 'set my [category] budget to $X'",
    tool: async (params: { category: string; newLimit: number }) => {
      updateBudgetLimit(params.category, params.newLimit);
      // Return the updated list of budgets formatted appropriately for BudgetTracker
      const updatedBudgets = await getBudgetStatusHelper();
      return { budgets: updatedBudgets };
    },
    inputSchema: z.object({
      category: z.string().describe("Category name (e.g., Dining, Groceries)"),
      newLimit: z.number().describe("New budget limit in dollars"),
    }),
    outputSchema: budgetTrackerSchema,
  }),
];
