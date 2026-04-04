/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: '#F5F1EC',
        ivory: '#FAF9F6',
        charcoal: '#2B2B2B',
        sage: '#9CAF88',
        blush: '#E6B8B7',
        navy: '#1F2A44',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
