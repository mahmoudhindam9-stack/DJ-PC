/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#080a0f',
          800: '#0d1118',
          700: '#121722',
          600: '#1a2232',
          500: '#232e42',
        },
        brand: {
          accent: '#ef3b3b',
          glow: '#f45b5b',
          cyan: '#38bdf8',
          green: '#4ade80',
          amber: '#f59e0b',
        }
      }
    },
  },
  plugins: [],
}
