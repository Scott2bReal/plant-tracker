/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'teal-cycle':
          'linear-gradient(to right, rgb(20 184 166), rgb(14 116 144), rgb(20 184 166))',
      },
    },
  },
  plugins: [],
}
