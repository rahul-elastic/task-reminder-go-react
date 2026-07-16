# Dark Mode Feature

## Overview

Added a complete dark mode implementation to the task reminder app with:
- **Light/Dark toggle button** in the header with moon (🌙) and sun (☀️) icons
- **Persistent preference** - remembers user's choice in localStorage
- **System preference detection** - defaults to system preference if no saved choice
- **Smooth transitions** - elegant color and background transitions
- **Comprehensive styling** - all UI elements styled for both light and dark themes

## Components & Hooks

### useDarkMode Hook (`frontend/src/hooks/useDarkMode.ts`)

Custom React hook that manages dark mode state and persistence.

**Features:**
```typescript
const { isDark, toggle } = useDarkMode()
```

**Behavior:**
1. On first load, checks localStorage for saved theme preference
2. If no preference saved, checks system dark mode preference (`prefers-color-scheme`)
3. Sets `data-theme="dark"` attribute on `<html>` when dark mode is active
4. Persists user choice to localStorage
5. Updates both when user toggles

**Automatic Dark Mode Detection:**
- System preference is used as fallback if no saved preference exists
- User can override system preference by toggling

### DarkModeToggle Component (`frontend/src/components/DarkModeToggle.tsx`)

Button component that appears in the header for toggling dark mode.

**Props:**
```typescript
type Props = {
  isDark: boolean
  onToggle: () => void
}
```

**Features:**
- Shows 🌙 icon in light mode
- Shows ☀️ icon in dark mode
- Accessible aria-label and title attributes
- Hover and active states with smooth animations
- Square button with rounded corners (consistent with design)

## CSS Implementation

### index.css - CSS Variables

Two sets of CSS variables defined:

**Light Mode (`:root`):**
```css
--ink: #1c1917;           /* Text color */
--muted: #78716c;         /* Secondary text */
--line: #e7e5e4;          /* Borders */
--surface: rgba(255, 255, 255, 0.82); /* Cards/inputs */
--accent: #0f766e;        /* Primary color */
--accent-hover: #0d9488;  /* Hover state */
--accent-soft: rgba(15, 118, 110, 0.15); /* Soft backgrounds */
--danger: #b91c1c;        /* Error/delete color */
--danger-soft: rgba(185, 28, 28, 0.1); /* Soft error bg */
--bg-top: #f0fdfa;        /* Gradient top */
--bg-bottom: #fafaf9;     /* Gradient bottom */
```

**Dark Mode (`[data-theme="dark"]`):**
```css
--ink: #f5f5f4;           /* Light text for dark bg */
--muted: #a8a29e;         /* Muted text darker */
--line: #44403c;          /* Darker borders */
--surface: rgba(28, 25, 23, 0.6); /* Dark cards */
--accent: #14b8a6;        /* Brighter teal for dark */
--accent-hover: #2dd4bf;  /* Bright hover */
--accent-soft: rgba(20, 184, 166, 0.15); /* Soft teal bg */
--danger: #fca5a5;        /* Lighter error for dark */
--danger-soft: rgba(252, 165, 165, 0.1); /* Soft error bg */
--bg-top: #1a1a1a;        /* Very dark top */
--bg-bottom: #2a2a2a;     /* Dark bottom */
```

### App.css - Button Styling

`.dark-mode-toggle` - The header button with:
- 2.5rem × 2.5rem size
- Border and surface background that respects theme
- Hover state with accent color and soft glow
- Active state with scale-down effect
- Smooth transitions (0.15s)
- Centered emoji icon

## App.tsx Changes

### Header Layout Update
- Wrapped title and description in a `<div>`
- Added flex container (`.app__header__top`) with space-between
- DarkModeToggle positioned in top-right of header
- Uses flexbox for responsive alignment

### Dark Mode Integration
```typescript
const { isDark, toggle: toggleDarkMode } = useDarkMode()

// In JSX:
<DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
```

## How It Works End-to-End

1. **Page Load:**
   - `useDarkMode` hook runs initialization
   - Checks `localStorage.theme`
   - Falls back to system preference
   - Sets `data-theme` attribute on `<html>`

2. **User Clicks Toggle:**
   - `toggleDarkMode()` invoked
   - `isDark` state flips
   - Hook updates `data-theme` attribute
   - Saves preference to localStorage

3. **CSS Variables Update:**
   - Browser reads `[data-theme="dark"]` selector
   - All color variables switch automatically
   - All elements using `var(--*)` update instantly
   - Backgrounds and text colors transition smoothly

4. **Persistence:**
   - localStorage key: `"theme"`
   - Saved value: `"dark"` or `"light"`
   - Survives page reloads and browser sessions

## Browser Compatibility

- ✅ CSS Custom Properties (all modern browsers)
- ✅ localStorage API (all browsers)
- ✅ `prefers-color-scheme` media query (modern browsers)
- ✅ Emoji support (all modern browsers)
- 🔄 Graceful fallback to light mode if localStorage unavailable

## Testing Checklist

- [ ] Click toggle button and verify colors change smoothly
- [ ] Refresh page and verify preference is remembered
- [ ] Clear localStorage and refresh - should use system preference
- [ ] Change system dark mode setting - should reflect on first load
- [ ] Verify all elements are readable in both themes
  - Form inputs
  - Task items
  - Buttons
  - Text and backgrounds
- [ ] Check hover and focus states in both themes
- [ ] Test on mobile with system dark mode

## Visual Design Details

**Dark Mode Accent Colors:**
- Brighter teal (#14b8a6 → #2dd4bf) for better contrast on dark
- More saturated to maintain visual interest
- Lighter danger color (#fca5a5) for error states

**Backgrounds:**
- Light mode: Soft teal/white gradients with transparency
- Dark mode: Darker gradients with subtle teal tints
- Surface elements: Semi-transparent dark overlays in dark mode

**Text:**
- Light mode: Dark text (#1c1917) on light backgrounds
- Dark mode: Light text (#f5f5f4) on dark backgrounds
- Both with sufficient contrast ratios for accessibility

**Transitions:**
- 0.3s smooth transition on body background
- 0.15s transitions on interactive elements
- No transition on initial page load (avoids flash)

## Future Enhancements

1. **System Preference Listener:**
   - Listen for `prefers-color-scheme` changes
   - Auto-update if user changes system setting

2. **More Theme Options:**
   - "Auto" (follow system) vs manual override toggle
   - Multiple color schemes (not just light/dark)

3. **Local Storage Debug:**
   - Add dev tools to inspect theme preference
   - Easy reset to system default

4. **Reduced Motion:**
   - Respect `prefers-reduced-motion` for accessibility
   - Disable transitions if user prefers

5. **Theme Persistence Across Devices:**
   - Sync theme preference with user account (requires auth)
   - Cloud sync for logged-in users
