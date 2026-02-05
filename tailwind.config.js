/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Ahora "gaming" será el nombre de tu clase en Tailwind
        'gaming': ['Kablammo', 'cursive'], 
      },
    },
  },
}