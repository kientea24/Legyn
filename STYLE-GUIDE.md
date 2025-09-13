# LEGYN Cyberpunk Style Guide

## Design Philosophy
The LEGYN app follows a **Cyberpunk 2077-inspired aesthetic** with neon colors, glitch effects, and futuristic UI elements. The design emphasizes high contrast, vibrant accents, and a dark tech atmosphere.

## Color Palette

### Primary Colors
- **Neon Pink**: `#ff007f` - Primary accent, CTAs, highlights
- **Neon Cyan**: `#00ffff` - Secondary accent, links, borders
- **Neon White**: `#ffffff` - Text, primary content

### Background Colors
- **Dark Background**: `#0a0a0f` - Main background
- **Darker Background**: `#050507` - Section variations

### Accent Colors
- **Purple Glow**: `#8a2be2` - Gradient accents
- **Yellow Accent**: `#ffff00` - Status indicators, special highlights
- **Grid Color**: `rgba(255, 0, 127, 0.1)` - Grid overlays

### Semantic Colors
- **Active Status**: Neon Pink (`#ff007f`)
- **Recruiting Status**: Yellow (`#ffff00`)
- **Success**: Green (`#28ca42`)
- **Warning**: Yellow (`#ffbd2e`)
- **Error**: Red (`#ff5f57`)

## Typography

### Font Families
- **Headings**: `'Orbitron', monospace` - Tech, futuristic feel
- **Body Text**: `'Rajdhani', sans-serif` - Clean, readable
- **Code/Terminal**: `'Courier New', monospace` - Terminal sections

### Font Sizes
- **Hero Title**: `clamp(3rem, 8vw, 6rem)`
- **Section Title**: `3rem` (mobile: `2rem`)
- **Card Title**: `1.5rem`
- **Body Text**: `1rem`
- **Small Text**: `0.8rem - 0.9rem`

### Font Weights
- **Orbitron**: 400, 700, 900
- **Rajdhani**: 300, 400, 500, 600, 700

### Text Effects
- **Neon Text Shadow**: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor`
- **Letter Spacing**: `1px` for uppercase text
- **Text Transform**: `uppercase` for buttons and labels

## Spacing System

### Container
- **Max Width**: `1200px`
- **Section Padding**: `4rem 2rem` (mobile: `2rem 1rem`)
- **Hero Padding**: `2rem` (mobile: `1rem`)

### Grid Gaps
- **Large**: `3rem`
- **Medium**: `2rem`
- **Small**: `1rem`
- **XSmall**: `0.5rem`

## Components

### Buttons

#### Primary Button
```css
background: linear-gradient(45deg, var(--neon-pink), var(--purple-glow));
color: var(--neon-white);
padding: 1rem 2rem;
text-transform: uppercase;
letter-spacing: 1px;
box-shadow: 0 0 30px rgba(255, 0, 127, 0.3);
```

#### Secondary Button
```css
background: transparent;
color: var(--neon-cyan);
border: 2px solid var(--neon-cyan);
padding: 1rem 2rem;
box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
```

#### Button Hover States
- Transform: `translateY(-3px)`
- Enhanced box-shadow with increased spread
- Glow effect animation

### Cards

#### Project Card
```css
background: rgba(10, 10, 15, 0.8);
border: 1px solid rgba(255, 0, 127, 0.3);
padding: 1.5rem;
transition: all 0.3s ease;
```

#### Card Hover
- Transform: `translateY(-10px)`
- Border color: `var(--neon-pink)`
- Box shadow: `0 20px 50px rgba(255, 0, 127, 0.3)`

### Navigation

#### Navbar
- Fixed position with backdrop blur
- Background: `rgba(10, 10, 15, 0.9)`
- Border bottom: `1px solid var(--neon-pink)`

#### Nav Links
- Hover: Color change to neon-pink with text shadow
- Animated underline on hover using pseudo-element

### Forms & Inputs
- Dark backgrounds with neon borders
- Focus states with enhanced glow effects
- Placeholder text at 60% opacity

## Animations

### Glitch Effect
```css
@keyframes glitch {
  2%, 64% { transform: translate(2px, 0) skew(0deg); }
  4%, 60% { transform: translate(-2px, 0) skew(0deg); }
  62% { transform: translate(0, 0) skew(5deg); }
}
```

### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(20px) rotate(240deg); }
}
```

### Pulse Animation
```css
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}
```

### Grid Movement
```css
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}
```

## Visual Effects

### Neon Glow
- Use box-shadow with multiple layers
- Apply to buttons, cards, and interactive elements
- Intensity increases on hover

### Grid Overlays
- Semi-transparent grid patterns using gradients
- Animated movement for dynamic feel
- Size: 50px or 100px squares

### Blur Effects
- Backdrop filter blur for overlays
- Blur radius: 20px for navigation, 100px for particles

### Gradient Usage
- Linear gradients for buttons and backgrounds
- Radial gradients for glow effects
- Angle: typically 45deg or 135deg

## Responsive Breakpoints

### Desktop
- Default styles apply

### Tablet (max-width: 768px)
- Navigation menu hidden, hamburger shown
- Single column layouts for grids
- Reduced font sizes

### Mobile (max-width: 480px)
- Further reduced padding
- Simplified animations
- Stacked buttons and elements

## State Classes

### Interactive States
- `.active` - Active/selected state
- `.hover` - Hover effects
- `.disabled` - Disabled elements (50% opacity)
- `.loading` - Loading states with animations

### Status Indicators
- `.status.active` - Pink glow
- `.status.recruiting` - Yellow glow
- `.status.pending` - Cyan glow

## Accessibility

### Color Contrast
- Ensure text meets WCAG AA standards
- Primary text: white on dark backgrounds
- Use opacity variations for hierarchy

### Focus States
- Visible focus outlines using neon colors
- Keyboard navigation support
- Skip links for screen readers

## Implementation Guidelines

### When Adding New Features
1. **Always use existing color variables** from `:root`
2. **Maintain consistent spacing** using the defined system
3. **Apply neon effects** to interactive elements
4. **Use appropriate fonts** based on content type
5. **Include hover/active states** for all interactive elements
6. **Test responsive behavior** at all breakpoints
7. **Ensure animations are smooth** and not distracting

### Component Patterns
- Headers: Orbitron font with neon text shadow
- Buttons: Uppercase with letter spacing
- Cards: Dark backgrounds with neon borders
- Sections: Alternating background darkness
- Overlays: Grid patterns or circuit designs

### Animation Best Practices
- Keep animations under 3 seconds
- Use `ease` or `ease-in-out` timing
- Provide `prefers-reduced-motion` alternatives
- Avoid excessive simultaneous animations

## File References
- **Main Stylesheet**: `/legyn-app/cyberpunk-style.css`
- **HTML Template**: `/legyn-app/cyberpunk-landing.html`
- **JavaScript**: `/legyn-app/cyberpunk-script.js`

---

**Note**: This style guide should be referenced whenever making UI changes to ensure consistency with the established Cyberpunk aesthetic.