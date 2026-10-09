/**
 * Tailwind CSS configuration
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        body: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        lux: {
          bg: '#F8F9FB',
          surface: '#FFFFFF',
          text: '#17191F',
          secondary: '#697386',
          muted: '#8F9CAE',
          border: '#E7E9EE',
          'border-subtle': '#F0F2F6',
          cobalt: '#3659D9',
          'cobalt-hover': '#2C49B8',
          'cobalt-active': '#233A96',
          'cobalt-subtle': '#EEF2FF',
          'cobalt-border': '#D8E2FD',
          success: '#0E9F6E',
          'success-subtle': '#EDFBF6',
          'success-border': '#B7EEDB',
          warning: '#D97706',
          'warning-subtle': '#FFFBEB',
          'warning-border': '#FDE68A',
          error: '#E02424',
          'error-subtle': '#FDF2F2',
          'error-border': '#F8B4B4',
        },
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#3659D9',
          700: '#2C49B8',
          800: '#233A96',
          900: '#1E293B',
          950: '#0F172A',
        },
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(16, 24, 40, 0.03)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)',
        'card-hover': '0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
        'dropdown': '0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.03)',
      },
      borderRadius: {
        'subtle': '6px',
        'card': '12px',
        'panel': '14px',
      },
    },
  },
  plugins: [],
};
