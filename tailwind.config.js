/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        surface: 'rgba(255,255,255,0.06)',
        'surface-strong': 'rgba(255,255,255,0.08)',
        borderGlass: 'rgba(255,255,255,0.10)',
        primary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          violet: '#8B5CF6',
          deep: '#4F46E5'
        },
        accent: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          glow: 'rgba(6,182,214,0.35)'
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'Tahoma', 'sans-serif'],
        display: ['Lalezar', 'Vazirmatn', 'system-ui', 'sans-serif']
      },
      backdropBlur: {
        glass: '16px'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.36), 0 0 0 1px rgba(255,255,255,0.06) inset',
        glow: '0 0 40px rgba(99,102,241,0.25), 0 0 80px rgba(6,182,214,0.15)',
        'glow-accent': '0 0 24px rgba(6,182,214,0.4)'
      },
      borderRadius: {
        glass: '16px',
        pill: '999px'
      },
      maxWidth: {
        content: '1280px'
      },
      opacity: {
        6: '0.06',
        7: '0.07',
        8: '0.08',
        12: '0.12',
        18: '0.18',
        66: '0.66'
      },
      transitionDuration: {
        400: '400ms'
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
