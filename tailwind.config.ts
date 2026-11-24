import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Swiss Academic Monograph palette derived from the LogiCore seal (#0A2463) on warm archival stock
        paper: {
          DEFAULT: '#F7F6F2',
          tint:    '#EFECE4',
          stock:   '#FFFFFF',
        },
        ink: {
          DEFAULT: '#0B1220',
          muted:   '#4A5568',
          subtle:  '#64748B',
        },
        rule: {
          DEFAULT: '#E5E5E5',
          strong:  '#D1D5DB',
        },
        // Brand navy from logo orbit ring + flat cobalt signal
        navy: {
          950: '#050F2B',
          900: '#0A2463',
          800: '#10317E',
          700: '#1A429D',
          600: '#2754B8',
        },
        cobalt: {
          50:  '#EDF3FF',
          100: '#D9E6FF',
          200: '#B8D1FF',
          500: '#0052CC',
          600: '#0047B3',
          700: '#003A94',
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
