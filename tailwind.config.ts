import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        bronze: {
          dark:    '#3d1f0d',
          DEFAULT: '#8b4513',
          mid:     '#c47a4a',
          light:   '#e8c49a',
          pearl:   '#f0d5b0',
        },
        cc: {
          black: '#000000',
          dark:  '#1d1d1f',
          gray1: '#3a3a3c',
          gray2: '#86868b',
          gray3: '#d2d2d7',
          gray4: '#f5f5f7',
          white: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

export default config