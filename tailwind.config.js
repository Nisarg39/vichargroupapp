/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1CB0F6',
          50: '#E8F7FE',
          100: '#D4F0FD',
          200: '#ACE3FB',
          300: '#84D5F9',
          400: '#5CC8F8',
          500: '#1CB0F6',
          600: '#0991D3',
          700: '#076C9C',
          800: '#054866',
          900: '#02232F'
        },
        cardinal: {
          DEFAULT: '#FF4B4B',
          50: '#FFF0F0',
          100: '#FFE1E1',
          200: '#FFC4C4',
          300: '#FFA7A7',
          400: '#FF8989',
          500: '#FF4B4B',
          600: '#FF1818',
          700: '#E60000',
          800: '#B30000',
          900: '#800000'
        },
        fox: {
          DEFAULT: '#FF9600',
          50: '#FFF4E5',
          100: '#FFE9CC',
          200: '#FFD499',
          300: '#FFBF66',
          400: '#FFAA33',
          500: '#FF9600',
          600: '#CC7800',
          700: '#995A00',
          800: '#663C00',
          900: '#331E00'
        },
        beetle: {
          DEFAULT: '#CE82FF',
          50: '#F9F0FF',
          100: '#F3E1FF',
          200: '#E7C4FF',
          300: '#DBA7FF',
          400: '#CF89FF',
          500: '#CE82FF',
          600: '#B54FFF',
          700: '#9C1CFF',
          800: '#7A00E6',
          900: '#5700A3'
        },
        humpback: {
          DEFAULT: '#2B70C9',
          50: '#E9F1F9',
          100: '#D3E3F4',
          200: '#A7C7E9',
          300: '#7BABDE',
          400: '#4F8FD3',
          500: '#2B70C9',
          600: '#2259A1',
          700: '#194379',
          800: '#102C50',
          900: '#081628'
        },
        green: {
          DEFAULT: '#58CC02',
          50: '#F2FBE9',
          100: '#E6F7D3',
          200: '#CCEFA7',
          300: '#B3E77B',
          400: '#99DF4F',
          500: '#58CC02',
          600: '#47A502',
          700: '#357C01',
          800: '#235201',
          900: '#122900'
        },
        ell: {
          DEFAULT: '#4b4b4b',
          light: '#757575',
          dark: '#222222'
        },
        snow: {
          DEFAULT: '#ffffff'
        }
      }
    },
  },
  plugins: [],
}