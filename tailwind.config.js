/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bunker-dark': '#0a0a0a',
        'bunker-gray': '#1a1a1a',
        'bunker-light': '#2a2a2a',
        'bunker-accent': '#00ff88',
        'bunker-yellow': '#ffaa00',
        'bunker-red': '#ff5555',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88' },
          '50%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88' },
        }
      }
    },
  },
  plugins: [],
}
