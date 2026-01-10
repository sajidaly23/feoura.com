/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'feoura-blue': '#3B82F6',
        'feoura-purple': '#8B5CF6',
      },
    },
  },
  plugins: [],
}

