# Personal Finance Command Center

A Next.js application showing **Generative UI** in action for personal finance. Users interact with their data through natural language, and the AI (powered by Tambo SDK) decides which UI components to render based on the context.

## Features

- **Generative UI**: The interface adapts to user intent (Charts, Lists, Warnings).
- **Natural Language Querying**: Ask "How much did I spend on dining?" or "Show my budget status".
- **Dynamic Charting**: Recharts integration for bar, line, and pie charts.
- **Budget Tracking**: Visual progress bars and warning indicators.
- **Financial Insights**: AI-driven analysis of spending habits.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **AI/UI SDK**: @tambo-ai/react
- **Styling**: Tailwind CSS
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file and add your Tambo API key:

   ```env
   NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
   ```

3. **Run Development Server**:

   ```bash
   npm run dev
   ```

4. **Open Application**:
   Navigate to [http://localhost:3000/chat](http://localhost:3000/chat) to start interacting.

## Example Prompts to Try

- "Show me my spending by category" (Renders a Bar Chart)
- "Am I going over budget anywhere?" (Renders InsightCards and BudgetTracker)
- "Show me my dining spending last week" (Renders TransactionList)
- "What is the trend of my expenses?" (Renders Line Chart)
- "Set my groceries budget to $500" (Updates budget and shows confirmation)

## Project Structure

- `src/components/`: UI Components (Charts, Cards, Lists)
- `src/lib/tambo.ts`: AI Component & Tool Registration
- `src/lib/mockData.ts`: Realistic mock financial data
- `src/app/chat/`: Main chat interface

---

Built for the Tambo Generative UI Hackathon.
