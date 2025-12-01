/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A6A40',
          dark: '#064F32',
          light: '#0F7743',
          gradient: {
            from: '#0A5330',
            to: '#0F7743',
          },
          50: '#E8F5F0',
          100: '#D1EBE1',
          200: '#A3D7C3',
          300: '#75C3A5',
          400: '#47AF87',
          500: '#0A6A40',
          600: '#085533',
          700: '#064F32',
          800: '#043A26',
          900: '#02251A',
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