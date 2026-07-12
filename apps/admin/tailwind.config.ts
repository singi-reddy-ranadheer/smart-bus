import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B5FFF',
        'primary-hover': '#0848C4',
        'primary-soft': '#E8F0FF',
        secondary: '#123152',
        accent: '#F5A524',
        success: '#168A5B',
        warning: '#B54708',
        error: '#D92D20',
        background: '#F7F9FC',
        surface: '#FFFFFF',
        'surface-subtle': '#F0F4F8',
        'on-surface': '#102A43',
        'on-surface-muted': '#627D98',
        outline: '#D9E2EC',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;