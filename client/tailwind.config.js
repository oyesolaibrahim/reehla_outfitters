/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "src/components/Home/Home.jsx",
    "src/components/Home/Sections/FirstSEction.jsx",
    "src/components/Home/Sections/SecondSection.jsx",
    "src/components/Home/Sections/ThirdSection.jsx",
    "src/components/Home/Sections/FourthSection.jsx",
    "src/components/Jalabs/Checkout.jsx",
    "src/components/Jalabs/CheckOut_Form.jsx",
    "src/components/Jalabs/Single_Jalab.jsx",
    "src/components/Jalabs/Article_Cart.jsx",
    "src/components/Article/Article.jsx",
    "src/components/Article/Article.jsx",
    "src/components/Signup/User_signup.jsx",
    "src/components/Header/Header.jsx",
    "src/components/Footer/Footer.jsx",
    "src/components/Login/User_login.jsx",
    "src/components/Jalabs/Male.jsx",
    "src/components/Jalabs/Brand.jsx",
  ],
  theme: {
    extend: {
      colors: {
        'primary-brown': '#3B2F2F', // For headers, footers, and text
        'soft-ivory': '#F9F6F2',   // Background color for the main content
        'muted-gold': '#D4A373',   // Accent color for buttons and highlights
        'charcoal-gray': '#4F4F4F', // Secondary text and borders
        'pure-white': '#FFFFFF',    // High contrast elements
    },
      keyframes: {
        slideInLeft: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        slideInRight: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        },
        popUp: {
          '0%': {
            transform: 'scale(0)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
        popDown: {
          '100%': {
            transform: 'scale(1)',
          },
          '0%': {
            transform: 'scale(0)',
          },
        },
      },
      animation: {
        'slideInLeft': 'slideInLeft 2s ease-out 0s 1 forwards',
        'slideInRight': 'slideInRight 2s ease-out 0s 1 forwards',
        'popUp': 'popUp 1s ease forwards', 
        'popDown': 'popDown 1s ease forwards', 
      },
      screens: {
        'xs': [{'min': '200px', 'max': '650px'}],
        'sm': [{'min': '651px', 'max': '849px'}],
        'md': [{'min': '850px', 'max': '1199px'}],
        'lg': '1200px', 
        //'xl': '1280px', // extra-large screens
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
