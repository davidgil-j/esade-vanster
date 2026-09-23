/** @type {import('tailwindcss').Config} */
// Los valores viven en src/app/globals.css (:root). Tailwind solo los nombra.
module.exports = {
  future: { hoverOnlyWhenSupported: true },
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        rule: 'var(--rule)',
        vanster: 'var(--vanster)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        heading: ['var(--font-display)'],
      },
    },
  },
  plugins: [],
};
