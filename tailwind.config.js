const { nextui } = require('@nextui-org/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/content/ui/*.tsx',
    // './node_modules/@nextui-org/theme/dist/components/switch.js'
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#2a2a2a', // or DEFAULT
            foreground: '#0d0d0d', // or 50 to 900 DEFAULT
            primary: {
              foreground: '#0d0d0d',
              DEFAULT: '#ff8e3c',
            },
            secondary: {
              foreground: '#0d0d0d',
              DEFAULT: '#d9376e',
            },
          },
        },
      },
    }),
  ],
};
