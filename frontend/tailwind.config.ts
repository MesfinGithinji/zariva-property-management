import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#dceee7',
          200: '#b9dccf',
          300: '#8bc4b0',
          400: '#5ca58e',
          500: '#3d8a74',
          600: '#2d6f5d',
          700: '#26594c',
          800: '#22483e',
          900: '#1d3c35',
          950: '#1B4332', // Main brand color
        },
        gold: {
          50: '#fdfbf3',
          100: '#faf5e1',
          200: '#f4e9c3',
          300: '#ecd89d',
          400: '#e3c36f',
          500: '#D4AF37', // Main gold color
          600: '#c19420',
          700: '#a0781b',
          800: '#84601c',
          900: '#6f4f1c',
          950: '#41290d',
        },
        cream: '#F5F1E8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
