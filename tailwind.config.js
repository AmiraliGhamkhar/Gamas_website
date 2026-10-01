/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      wide: '734px',
      md: '834px',
      lg: '1068px',
      xl: '1440px',
    },
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        parchment: 'var(--parchment)',
        'tile-dark': 'var(--tile-dark)',
        surface: 'var(--surface)',
        'surface-muted': 'var(--surface-muted)',
        'surface-dark': 'var(--surface-dark)',
        subtle: 'var(--border)',
        dark: 'var(--border-dark)',
        ink: 'var(--ink)',
        muted: 'var(--ink-muted)',
        'ink-subtle': 'var(--ink-subtle)',
        'on-dark': {
          DEFAULT: 'var(--on-dark)',
          muted: 'var(--on-dark-muted)',
          subtle: 'var(--on-dark-subtle)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          focus: 'var(--primary-focus)',
          'on-dark': 'var(--primary-on-dark)',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        none: 'var(--radius-0)',
        DEFAULT: 'var(--radius-8)',
        sm: 'var(--radius-8)',
        md: 'var(--radius-8)',
        lg: 'var(--radius-8)',
        xl: 'var(--radius-11)',
        '11': 'var(--radius-11)',
        '8': 'var(--radius-8)',
        '2xl': 'var(--radius-18)',
        '3xl': 'var(--radius-18)',
        '18': 'var(--radius-18)',
        full: 'var(--radius-pill)',
        pill: 'var(--radius-pill)',
      },
      maxWidth: { content: '1280px' },
      spacing: {
        section: 'var(--space-section)',
        'section-mobile': 'var(--space-section-mobile)',
      },
    },
  },
  plugins: [],
}
