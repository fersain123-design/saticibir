/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A5C36',
          50: '#E8F5EF',
          100: '#D1EBDF',
          200: '#A3D7BF',
          300: '#75C39F',
          400: '#47AF7F',
          500: '#0A5C36',
          600: '#084A2B',
          700: '#063720',
          800: '#042515',
          900: '#02120B',
        },
        accent: {
          DEFAULT: '#F5A623',
          50: '#FEF7EC',
          100: '#FDEFD9',
          200: '#FBDFB3',
          300: '#F9CF8D',
          400: '#F7BF67',
          500: '#F5A623',
          600: '#E89206',
          700: '#B47205',
          800: '#805203',
          900: '#4C3102',
        },
        background: {
          light: '#FAFAFA',
          DEFAULT: '#F5F5F5',
          white: '#FFFFFF',
        },
        text: {
          primary: '#1E1E1E',
          secondary: '#6B7280',
        },
        success: '#10B981',
        warning: '#FACC15',
        error: '#EF4444',
        info: '#3B82F6',
        gray: {
          DEFAULT: '#9CA3AF',
          light: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
}