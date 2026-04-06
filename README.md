# Zorvyn FinTrack

A stunning, premium neumorphic financial dashboard built with modern React. FinTrack helps you track transactions, manage monthly budgets, and monitor your investment portfolio in a deeply satisfying, tactile environment.

## Overview of Approach

Tactile Finance is designed around **neumorphic principles** to create an interface that feels alive. By using soft shadows, inset shadows, and subtle animations, elements feel like physical buttons and cards that respond to your touch.

### Tech Stack
- **Core Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (with custom neumorphic tailwind variations)
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React

All styling relies strictly on utility classes and CSS variables without using any heavy external component libraries. This provides ultimate control over performance and aesthetics while ensuring the light/dark themes deeply integrate with the shadows required for neumorphism.

## Features

- **Dashboard Overview**: Get a bird's eye view of your cash flow. Calculates your total balance, monthly spend, month-over-month trends, and your current savings rate. Includes dynamically generated, contextual insights based on your spending.
- **Transactions Management**: Fully filterable and searchable ledger of your financial history. (Admin mode allows adding and removing new records).
- **Intelligent Budgets**: Visual budget progress bars that track your spending against category caps in real-time.
- **Investment Portfolio**: Track stock holdings with real-time P&L calculations alongside a dynamic SVG allocation donut chart.
- **Deep Theming & Roles**: 
  - Complete Dark/Light mode support with distinct shadow configurations for each to ensure high legibility.
  - Granular Access Control (Admin vs Viewer) that disables edits to records.

## etup Instructions

1. **Clone the repository and install dependencies**
   Make sure you are running a recent version of Node (v20+ recommended).
   ```bash
   npm install
   ```

2. **Start the local development server**
   ```bash
   npm run dev
   ```

3. **View the app**
   Open your browser to the local URL (usually `http://localhost:3000/`) provided by Vite in the terminal.

4. **Production Build**
   To build for production, run:
   ```bash
   npm run build
   ```
   This will output optimized, minified static files into the `dist` directory.

## Project Structure

- `src/components/` - UI building blocks (StatCards), Layout (Sidebar), and Page Views (Transactions, Budgets, Investments, Settings)
- `src/context/` - Global state management for data routing, and theme settings.
- `src/api/` - Mock API layer for data loading simulators.
- `src/data/` - Static mock assets and dummy initial transactions.
- `src/index.css` - Custom Tailwind theme variants and neumorphic utility classes.

Enjoy tracking your finances with style!