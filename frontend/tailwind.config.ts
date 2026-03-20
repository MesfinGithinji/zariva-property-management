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
          50: '#eef5f0',
          100: '#d5e8dc',
          200: '#aed1bc',
          300: '#7eb497',
          400: '#52966f',
          500: '#357a55',
          600: '#2D6040', // Logo hill/accent green
          700: '#254e35',
          800: '#1e3f2b',
          900: '#183323',
          950: '#1A3626', // Exact logo background green
        },
        gold: {
          50: '#fdf9ee',
          100: '#f9f0d0',
          200: '#f2dfa0',
          300: '#e9c96a',
          400: '#dfb444',
          500: '#C9A843', // Main logo gold
          600: '#b08a2e',
          700: '#8f6d24',
          800: '#755520',
          900: '#62461e',
          950: '#3a280e',
        },
        cream: '#F5F1E8',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
