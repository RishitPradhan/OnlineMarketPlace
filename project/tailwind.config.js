/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette - Pitch black with neon green for dark mode, white with green for light mode
        primary: {
          50: '#f0fdf4', // Neon green
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main neon green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#000000', // Pitch black
        },
        light: {
          50: '#ffffff', // White background
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
          900: '#0f172a',
          950: '#000000',
        },
        accent: {
          50: '#f0fdf4', // Neon green for dark mode
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Main neon green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Custom gray colors without blue tint
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        border: '#22c55e', // Neon green border for dark mode - more prominent
        background: '#000000', // Pitch black background for dark mode
        foreground: '#ffffff', // White text for black background
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-green-glow': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
        'dark-gradient': 'linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%)', // Pure pitch black
        'light-gradient': 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #dcfce7 100%)', // White to green gradient
        'green-glow': 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
      },
      boxShadow: {
        'neon-green-glow': '0 0 20px rgba(34, 197, 94, 0.4)',
        'neon-green-glow-lg': '0 0 40px rgba(34, 197, 94, 0.6)',
        'green-glow': '0 0 20px rgba(34, 197, 94, 0.3)',
        'green-glow-lg': '0 0 40px rgba(34, 197, 94, 0.4)',
        'dark-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
        'light-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-neon-green': 'pulse-neon-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-green': 'pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon-green': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.7)',
          },
        },
        'pulse-green': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)',
          },
        },
        glow: {
          from: {
            textShadow: '0 0 10px rgba(34, 197, 94, 0.6)',
          },
          to: {
            textShadow: '0 0 20px rgba(34, 197, 94, 0.9), 0 0 30px rgba(34, 197, 94, 0.7)',
          },
        },
      },
    },
  },
  plugins: [],
};