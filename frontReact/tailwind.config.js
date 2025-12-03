/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'azure-radiance': {
          900: '#233985',
        },
      },
    },
  },
  plugins: [],
}

