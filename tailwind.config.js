/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // PIQ Brand Colors
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        // Risk Level Colors
        risk: {
          low: '#34C759',      // iOS Green
          moderate: '#FF9500', // iOS Orange
          high: '#FF3B30',     // iOS Red
        },
        // Action Colors
        action: {
          hold: '#007AFF',     // iOS Blue
          increase: '#34C759', // iOS Green
          reduce: '#FF3B30',   // iOS Red
        },
        // iOS-style UI Colors
        background: '#F2F2F7',
        surface: '#FFFFFF',
        border: 'rgba(60, 60, 67, 0.12)',
        // iOS Glass/Material colors
        glass: {
          white: 'rgba(255, 255, 255, 0.78)',
          'white-thick': 'rgba(255, 255, 255, 0.92)',
          'white-thin': 'rgba(255, 255, 255, 0.6)',
          dark: 'rgba(28, 28, 30, 0.78)',
          'dark-thick': 'rgba(28, 28, 30, 0.92)',
          ultraThin: 'rgba(255, 255, 255, 0.45)',
        },
        // iOS System colors
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
          gray: '#8E8E93',
          'gray-2': '#AEAEB2',
          'gray-3': '#C7C7CC',
          'gray-4': '#D1D1D6',
          'gray-5': '#E5E5EA',
          'gray-6': '#F2F2F7',
          separator: 'rgba(60, 60, 67, 0.29)',
          'separator-opaque': '#C6C6C8',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'SF Pro Text', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['SF Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        // iOS-style shadows
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'ios': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'ios-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'ios-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'ios-xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
        // Glass shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.08)',
        // Card styles
        'card': '0 1px 3px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.04)',
        // Inner glow for vibrancy effect
        'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.5)',
      },
      borderRadius: {
        'ios': '10px',
        'ios-lg': '14px',
        'ios-xl': '20px',
        'ios-2xl': '28px',
        'card': '16px',
      },
      backdropBlur: {
        'ios': '20px',
        'ios-lg': '40px',
        'ios-xl': '80px',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'ios-spring': 'iosSpring 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        iosSpring: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 122, 255, 0.6)' },
        },
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ios-spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
