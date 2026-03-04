import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        secondary: {
          50:  'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          card:    'var(--color-surface-card)',
          hover:   'var(--color-surface-hover)',
        },
        'text-base':   'var(--color-text-base)',
        'text-muted':  'var(--color-text-muted)',
        'text-invert': 'var(--color-text-invert)',
        'status-open': {
          bg:   'var(--color-status-open-bg)',
          text: 'var(--color-status-open-text)',
          dot:  'var(--color-status-open-dot)',
        },
        'status-closed': {
          bg:   'var(--color-status-closed-bg)',
          text: 'var(--color-status-closed-text)',
          dot:  'var(--color-status-closed-dot)',
        },
        warning: {
          border: 'var(--color-warning-border)',
          bg:     'var(--color-warning-bg)',
          title:  'var(--color-warning-title)',
          text:   'var(--color-warning-text)',
        },
        error: {
          border: 'var(--color-error-border)',
          bg:     'var(--color-error-bg)',
          text:   'var(--color-error-text)',
          muted:  'var(--color-error-muted)',
        },
        skeleton: {
          strong: 'var(--color-skeleton-strong)',
          subtle: 'var(--color-skeleton-subtle)',
        },
        chip: {
          border: 'var(--color-chip-border)',
          bg:     'var(--color-chip-bg)',
          text:   'var(--color-chip-text)',
        },
        toggle: {
          off:  'var(--color-toggle-off)',
          knob: 'var(--color-toggle-knob)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn:  'var(--radius-btn)',
      },
      boxShadow: {
        card:    'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
} satisfies Config
