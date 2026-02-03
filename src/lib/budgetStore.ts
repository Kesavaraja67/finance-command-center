import { budgets as initialBudgets, Budget } from './mockData';

let currentBudgets = [...initialBudgets];

export const getBudgets = () => currentBudgets;

export const updateBudgetLimit = (category: string, newLimit: number) => {
  const budget = currentBudgets.find(b => b.category.toLowerCase() === category.toLowerCase());
  if (budget) {
    budget.limit = newLimit;
  }
  return currentBudgets;
};

export const resetBudgets = () => {
  currentBudgets = [...initialBudgets];
  return currentBudgets;
};
