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