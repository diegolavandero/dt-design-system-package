/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./src/ds/tailwind-preset.cjs')],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
};
