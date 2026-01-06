/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors matching the screenshots
        'deepr-bg': '#0a0a0f',
        'deepr-card': '#12121a',
        'deepr-border': '#1e1e2e',
        'deepr-hover': '#1a1a24',
        'deepr-accent': '#8b5cf6',
        'deepr-accent-hover': '#7c3aed',
        'deepr-text': '#e2e8f0',
        'deepr-text-muted': '#94a3b8',
        'deepr-success': '#10b981',
        'deepr-warning': '#f59e0b',
        'deepr-error': '#ef4444',
        'deepr-info': '#3b82f6',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
