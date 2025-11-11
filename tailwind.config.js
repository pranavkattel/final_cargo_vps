/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Smoke Grey Color Scheme - 60-30-10 Rule
        'primary-white': '#F5F5F5',        // 60% - Light smoke grey (main background)
        'primary-blue': '#4A5568',         // 30% - Medium grey (secondary elements)
        'accent-orange': '#718096',        // 10% - Dark grey (accent/highlights)
        'accent-orange-hover': '#2D3748',  // Darker grey for hover states
        'smoke-light': '#F7FAFC',          // Extra light grey
        'smoke-medium': '#E2E8F0',         // Medium light grey
        'smoke-dark': '#2D3748',           // Dark grey for text
        'smoke-darker': '#1A202C',         // Darkest grey
      },
      backgroundColor: {
        'primary-white': '#F5F5F5',
        'primary-blue': '#4A5568',
        'accent-orange': '#718096',
        'smoke-light': '#F7FAFC',
        'smoke-medium': '#E2E8F0',
        'smoke-dark': '#2D3748',
      },
      textColor: {
        'primary-blue': '#4A5568',
        'accent-orange': '#718096',
        'smoke-dark': '#2D3748',
        'smoke-darker': '#1A202C',
      },
      borderColor: {
        'accent-orange': '#718096',
        'smoke-medium': '#E2E8F0',
      },
      ringColor: {
        'accent-orange': '#718096',
      },
    },
  },
  plugins: [],
}