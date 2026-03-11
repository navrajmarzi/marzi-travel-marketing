# Goa Float & Flaunt - Marzi Holidays

A full-screen, mobile-first interactive journey page for senior travellers 50+. This is a 6-screen swipeable/tappable story experience.

## Features

- **6 Interactive Screens**: Hero, Day 2 (Yacht/Casino), Day 3 (Heritage), Qualification, Form, Thank You
- **Mobile-First Design**: Single column on mobile, split layout (55% image / 45% content) on desktop
- **Smooth Transitions**: Opacity fade with cubic-bezier easing between screens
- **Touch Swipe Support**: Swipe left to navigate forward (screens 1-3)
- **Keyboard Navigation**: Arrow Right/Down to navigate (screens 1-3)
- **Form Validation**: Inline error messages with shake animation
- **Age Gate**: Gentle messaging for under-50 visitors
- **Staggered Animations**: Content fades up with staggered delays

## Brand Colors

- **Marzi Wine**: #841a4f (text, borders, buttons, accents)
- **Champagne**: #f9f5f0 (backgrounds)
- **Ivory**: #ffffff (card backgrounds)
- **Gold**: #c5a059 (eyebrows, tags, dividers)

## Fonts (Google Fonts)

- **Cinzel**: Headings
- **Playfair Display**: Italic mood lines
- **Montserrat**: Body/UI text

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

```bash
cd goa-journey
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
goa-journey/
├── index.html          # Entry HTML with Google Fonts
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── public/
│   └── vite.svg        # Favicon
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main app component with all screens
    └── index.css       # All styles (mobile-first)
```

## Screen Flow

1. **Hero** - Introduction with trust pills and CTA
2. **Float: Sea & Casino** - Day 2 activities
3. **Flaunt: Heritage** - Day 3 activities
4. **Qualification** - Age gate with scarcity counter
5. **Form** - Name, age, phone collection
6. **Thank You** - Confirmation with trip details
