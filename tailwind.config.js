/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FA',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#111111',
          hover: '#222222',
          light: '#333333',
        },
        secondary: {
          DEFAULT: '#6B7280',
          light: '#9CA3AF',
          dark: '#4B5563',
        },
        accent: {
          DEFAULT: '#FFD54A',
          hover: '#FFCA28',
          light: '#FFF0B3',
          dark: '#F5B000',
        },
        lemonGreen: '#10B981',
        lemonRed: '#EF4444',
        lemonBlue: '#3B82F6',
      },
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['Arial', '"Noto Sans Gujarati"', '"Noto Sans Devanagari"', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'accent': '0 4px 14px rgba(255, 213, 74, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
