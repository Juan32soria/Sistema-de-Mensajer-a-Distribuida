/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0084ff',
        secondary: '#e4e6eb',
        dark: '#1c1e21',
      }
    },
  },
  plugins: [],
}
