/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1E3E62',
          900: '#0B192C',
          950: '#070F1E',
        },
        brand: {
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-dark': '#0F766E',
          cyan: '#06B6D4',
          sky: '#0EA5E9',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(11, 25, 44, 0.06), 0 1px 3px -1px rgba(11, 25, 44, 0.04)',
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.07), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'elevated': '0 12px 32px -4px rgba(11, 25, 44, 0.12), 0 4px 12px -2px rgba(11, 25, 44, 0.06)',
      },
    },
  },
  plugins: [],
}
