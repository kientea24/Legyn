# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the LEGYN Cyberpunk Landing Page - a static website with a Cyberpunk 2077-inspired design for a community-built startup platform. The project is built with vanilla HTML, CSS, and JavaScript.

## Project Structure

```
/legyn-app/
├── cyberpunk-landing.html    # Main HTML file (entry point)
├── cyberpunk-script.js        # JavaScript functionality
├── cyberpunk-style.css        # Main stylesheet
├── package.json               # Node.js project configuration
└── node_modules/              # Dependencies (live-server for development)
```

## Development Commands

```bash
# Start development server with live reload (port 3000, no browser auto-open)
npm run dev

# Start development server with live reload (port 3000, opens browser)
npm start

# Build (no build process needed for static files)
npm run build

# Linting (not configured yet)
npm run lint
```

## Key Implementation Details

### HTML Structure (cyberpunk-landing.html)
- Single-page application with sections for hero, projects, community, and about
- Uses semantic HTML5 elements
- Integrates Google Fonts (Orbitron, Rajdhani)

### JavaScript Features (cyberpunk-script.js)
- Mobile navigation toggle with hamburger menu
- Smooth scrolling for anchor links
- Parallax scrolling effects on hero section
- Terminal typing animations
- Interactive glitch effects
- Form handling for newsletter and contact sections

### CSS Architecture (cyberpunk-style.css)
- Cyberpunk 2077-inspired design system
- CSS Grid and Flexbox layouts
- Custom animations (glitch effects, neon glows)
- Responsive design with mobile-first approach
- CSS variables for theme colors

## Development Server

The project uses `live-server` for local development:
- Automatically refreshes on file changes
- Serves static files
- Default port: 3000

## Style Guide

**IMPORTANT**: A comprehensive style guide is available at `/STYLE-GUIDE.md`. Always reference this guide when making any UI changes to ensure consistency with the established Cyberpunk 2077-inspired design system.

Key style guide highlights:
- **Color System**: Neon pink (#ff007f) and cyan (#00ffff) accents on dark backgrounds
- **Typography**: Orbitron for headings, Rajdhani for body text
- **Components**: Specific patterns for buttons, cards, navigation, and forms
- **Animations**: Glitch effects, floating particles, and neon glows
- **Responsive Design**: Mobile-first approach with defined breakpoints

Always ensure new UI elements follow the established design patterns and use the defined CSS variables.