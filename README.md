# Aura Project

A modern, high-performance full-stack dashboard built with **React**, **Vite**, and **Express.js**. Designed with a focus on "Visual Excellence," Aura features a sleek dark-mode aesthetic with glassmorphism and smooth micro-interactions.

## 🚀 Features

- **Premium Design System**: Custom Vanilla CSS design tokens with HSL-tuned colors and glassmorphic UI components.
- **Full-Stack Connectivity**: Seamless integration between a Vite-powered frontend and an Express backend.
- **Dynamic Stats & Tasks**: Live-fetching dashboard stats and project management overview.
- **Monorepo Structure**: Optimized for development with concurrent scripts.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 4
- **Backend**: Node.js, Express
- **Styling**: Vanilla CSS (Custom System)
- **Utilities**: Concurrently, Nodemon, Dotenv

## 📦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaif-ai-engineer/aura-project.git
   cd aura-project
   ```

2. Install dependencies for the root, client, and server:
   ```bash
   npm install
   cd client && npm install
   cd server && npm install
   cd ..
   ```

### Running Locally

To start both the client and server concurrently, run the following command from the root directory:

```bash
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 📂 Project Structure

```text
/
├── client/          # Vite + React Frontend
│   ├── src/         # UI Components and Design System
│   └── public/      # Static Assets
├── server/          # Express.js Backend
│   └── index.js     # API Entry point
└── package.json     # Monorepo configuration
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
