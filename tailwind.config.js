/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zh: {
          bg: '#080808',
          elevated: '#0f0f0f',
          card: '#141414',
          card2: '#1a1a1a',
          border: '#242424',
          border2: '#2e2e2e',
          teal: '#3dd9b3',
          'teal-dim': '#3dd9b320',
          'teal-mid': '#3dd9b340',
          text: '#f0f0f0',
          muted: '#666666',
          subtle: '#444444',
          user: '#1d3d31',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.4s ease-out',
        'waveform': 'waveform 1.2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      backgroundImage: {
        'gradient-teal': 'linear-gradient(135deg, #3dd9b3 0%, #2ab89a 100%)',
        'gradient-dark': 'linear-gradient(135deg, #141414 0%, #1a1a1a 100%)',
        'gradient-cinematic': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
      },
    },
  },
  plugins: [],
}
