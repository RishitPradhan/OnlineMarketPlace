# FreelanceHub - Freelance Marketplace

A comprehensive Fiverr-like freelance marketplace built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication System**: JWT-based authentication with role-based access control
- 👥 **Multi-Role Support**: Client, Freelancer, and Admin roles
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🎨 **Modern UI**: Clean, professional interface with smooth animations
- 🔒 **Secure**: Form validation with Zod and secure API endpoints
- 📊 **Dashboards**: Role-specific dashboards with analytics
- 💼 **Extensible**: Clean architecture ready for additional features

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Backend Server

The backend server provides the following API endpoints:

- `POST /api/create-payment-intent` - Create Stripe payment intents
- `POST /api/notify-freelancer` - Send notifications to freelancers
- `POST /api/create-upi-payment` - Handle UPI payments

**Note**: The server will work without Stripe configuration for development purposes, but payment features will be limited.

### Stripe Configuration

To enable real payment processing:

1. **Option 1: Use the provided scripts** (Recommended)
   ```bash
   # PowerShell
   .\start-server-with-stripe.ps1
   
   # Windows Batch
   start-server-with-stripe.bat
   
   # npm script
   npm run server:stripe
   ```

2. **Option 2: Set environment variables manually**
   ```bash
   # PowerShell
   $env:STRIPE_SECRET_KEY="your_stripe_secret_key"
   node server.cjs
   
   # Windows Command Prompt
   set STRIPE_SECRET_KEY=your_stripe_secret_key
   node server.cjs
   ```

3. **Option 3: Create a .env file**
   Create a `.env` file in the project root with:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=3001
   NODE_ENV=development
   ```

**Current Setup**: Your Stripe test key is already configured in the startup scripts.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials.

4. Set up the database:
   - Create a new Supabase project
   - Run the migration files in `/supabase/migrations/`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Start the backend server (in a separate terminal):
   ```bash
   # Without Stripe (mock payments):
   npm run server
   npm run start:server
   
   # With Stripe (real payments):
   npm run server:stripe
   
   # Or use the provided scripts:
   # Windows: start-server.bat (mock) or start-server-with-stripe.bat (real)
   # PowerShell: .\start-server.ps1 (mock) or .\start-server-with-stripe.ps1 (real)
   ```

   The backend server will run on http://localhost:3001

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── layout/         # Layout components
│   ├── ui/             # Reusable UI components
│   └── common/         # Common components
├── contexts/           # React contexts
├── lib/               # Utility functions
├── types/             # TypeScript types
└── hooks/             # Custom hooks
```

## Features Roadmap

- [ ] Gig Creation & Management
- [ ] Order Management System
- [ ] Real-time Messaging
- [ ] Payment Integration (Stripe)
- [ ] Review & Rating System
- [ ] File Upload & Management
- [ ] Advanced Search & Filtering
- [ ] Notification System
- [ ] Admin Panel
- [ ] Analytics Dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.