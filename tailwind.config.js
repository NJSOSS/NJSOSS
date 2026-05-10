/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#030912',
          card: '#060f1a',
          border: '#0d2535',
          text: '#8fb8cc',
          cyan: '#00d4ff',
          danger: '#ff2233',
          warning: '#ff7700',
          safe: '#00ff88',
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-danger': 'pulse-danger 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan-line': 'scan-line 4s linear infinite',
      },
      keyframes: {
        'pulse-danger': {
          '0%, 100%': { boxShadow: '0 0 5px #ff2233, 0 0 10px #ff2233' },
          '50%': { boxShadow: '0 0 20px #ff2233, 0 0 40px #ff2233, 0 0 60px #ff2233' },
        },
        'glow': {
          from: { textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff' },
          to: { textShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff, 0 0 60px #00d4ff' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
