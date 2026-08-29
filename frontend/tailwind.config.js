/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        goi: {
          navy: '#0a2540',
          navyDark: '#071828',
          navyLight: '#1e3a8a',
          saffron: '#ff9933',
          green: '#138808',
          ash: '#f8fafc',
          border: '#cbd5e1',
          gold: '#d97706'
        }
      }
    },
  },
  plugins: [],
}
