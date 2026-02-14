# Accessibility Features - LA Crime Map

## Overview

LA Crime Map is fully accessible and compliant with **WCAG 2.1 Level AA** standards. We believe that access to crime information is critical for public safety, and everyone deserves equal access to this data regardless of their abilities.

## Quick Access to Accessibility Features

- **Accessibility Settings Panel**: Click the gear icon (⚙️) in the top-right corner
- **Accessibility Statement**: Navigate to `#accessibility-statement` or click the link in the accessibility panel
- **Keyboard Navigation**: Press `Tab` to navigate, `Enter` to activate, `Escape` to close dialogs
- **Screen Readers**: Full NVDA, JAWS, VoiceOver, and TalkBack support

## Implemented Features

### 1. Visual Accessibility ✓

#### High Contrast Mode
- **What it does**: Increases color contrast to WCAG AAA levels
- **How to enable**: Accessibility Settings → High Contrast Mode
- **Benefits**: Better readability for users with low vision
- **Colors used**:
  - Background: Pure black (#000000)
  - Text: Pure white (#FFFFFF) and high-visibility yellow (#FFFF00)
  - Links: Cyan (#00FFFF)
  - Focus indicators: Yellow (#FFFF00)

#### Colorblind-Friendly Patterns
- **What it does**: Adds patterns and textures to map regions in addition to colors
- **How to enable**: Accessibility Settings → Colorblind-Friendly Patterns
- **Patterns**:
  - **Low severity**: Dotted pattern
  - **Moderate severity**: Diagonal lines
  - **High severity**: Horizontal lines
  - **Very high severity**: Crosshatch pattern
- **Benefits**: Users with color vision deficiency can distinguish severity levels

#### Adjustable Font Sizes
- **Options**: Small, Medium (default), Large, Extra Large
- **How to enable**: Accessibility Settings → Font Size
- **Persistence**: Setting saved across sessions
- **Scaling**: All UI elements scale proportionally

### 2. Keyboard Navigation ✓

#### Full Keyboard Support
- **Tab**: Navigate forward through interactive elements
- **Shift + Tab**: Navigate backward
- **Enter/Space**: Activate buttons and controls
- **Escape**: Close modals and panels
- **Arrow keys**: Navigate within grouped controls

#### Visible Focus Indicators
- **Default**: 2px solid blue outline (#6eb5ff)
- **High Contrast**: 4px solid yellow outline (#ffff00)
- **Offset**: 2-3px for clear visibility
- **All focusable elements**: Buttons, links, inputs, selects, custom controls

#### Skip Navigation Links
- **Skip to Main Content**: Bypass navigation and go straight to map/data
- **Skip to Navigation**: Jump to main navigation controls
- **How to use**: Press `Tab` on page load - skip links appear at the top

#### Logical Tab Order
- Header controls → Navigation tabs → Search/filters → Metric selectors → Map → Stats panel

### 3. Screen Reader Support ✓

#### ARIA Labels and Roles
- **Landmark Regions**: `banner`, `navigation`, `main`, `complementary`, `contentinfo`
- **Live Regions**: Dynamic updates announced with `aria-live="polite"`
- **Button States**: `aria-pressed` for toggle buttons, `aria-expanded` for panels
- **Form Controls**: All inputs have associated `<label>` elements
- **Descriptive Labels**: Clear, concise descriptions for all interactive elements

#### Screen Reader Announcements
- **Data loaded**: "Crime data loaded successfully. X neighborhoods available."
- **Metric changed**: "Switched to [metric]. Showing crime statistics."
- **Neighborhood hover**: "[Name]: [value] [metric] per week"
- **Search results**: "[count] neighborhoods found"
- **Errors**: Assertive announcements for critical errors

#### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- `<nav>`, `<main>`, `<aside>`, `<footer>` elements
- `<table>` with `<thead>`, `<tbody>`, proper headers
- Meaningful link text (no "click here")

### 4. Language Support ✓

#### Supported Languages
- **English** (default)
- **Spanish** (Español) - critical for LA's diverse population

#### Features
- **Auto-detection**: Detects browser language preference
- **Easy switching**: Change language anytime in Accessibility Settings
- **Persistent**: Language choice saved across sessions
- **Complete translation**: All UI text, labels, and messages
- **Proper `lang` attributes**: Set on `<html>` element

#### Coverage
- All interface text
- Form labels and placeholders
- Error messages
- Help text and instructions
- Accessibility announcements
- Crime type labels
- Time range options

### 5. Motion and Animation ✓

#### Respects Reduced Motion Preference
- **Auto-detects**: `prefers-reduced-motion: reduce` media query
- **Applies globally**: All transitions and animations disabled
- **Scroll behavior**: Instant scrolling instead of smooth
- **No auto-play**: No automatically playing content

#### Implementation
```css
.reduced-motion *,
.reduced-motion *::before,
.reduced-motion *::after {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
```

### 6. Touch and Input ✓

#### Minimum Touch Target Sizes
- **Standard**: 44x44 pixels (WCAG 2.1 Level AA)
- **Mobile**: 48x48 pixels for better touch accuracy
- **All interactive elements**: Buttons, links, inputs, custom controls
- **Spacing**: Adequate spacing between targets to prevent misclicks

#### Multiple Input Methods
- **Mouse**: Full mouse support with hover states
- **Touch**: Optimized touch targets and gestures
- **Keyboard**: Complete keyboard navigation
- **Voice Control**: Proper ARIA labels for voice commands
- **Screen Magnification**: Responsive design works with zoom up to 200%

## Testing

### Automated Testing
We use `axe-core` and `jest-axe` for automated accessibility testing:

```bash
npm test -- --testPathPattern=accessibility
```

### Manual Testing
The application has been tested with:
- **NVDA** (Windows screen reader)
- **JAWS** (Windows screen reader)
- **VoiceOver** (macOS/iOS screen reader)
- **TalkBack** (Android screen reader)
- **Keyboard-only navigation** (no mouse)
- **Browser zoom** (up to 200%)
- **Colorblindness simulators**

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Guidelines

### Adding New Features
When adding new features, ensure:

1. **Keyboard accessibility**: All functionality available via keyboard
2. **ARIA labels**: Proper labels and roles
3. **Color contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
4. **Focus indicators**: Visible focus states
5. **Screen reader testing**: Test with at least one screen reader
6. **Semantic HTML**: Use appropriate HTML elements
7. **Translations**: Add new text to i18n files (English and Spanish)

### Code Examples

#### Accessible Button
```tsx
<button
  onClick={handleClick}
  aria-label={t('button.label')}
  aria-pressed={isActive}
>
  {t('button.text')}
</button>
```

#### Accessible Input
```tsx
<div>
  <label htmlFor="search-input">
    {t('search.label')}
  </label>
  <input
    id="search-input"
    type="search"
    aria-label={t('search.label')}
    placeholder={t('search.placeholder')}
  />
</div>
```

#### Screen Reader Announcement
```tsx
const { announce } = useAccessibility();

// Polite announcement (doesn't interrupt)
announce(t('data.loaded'), 'polite');

// Assertive announcement (interrupts)
announce(t('error.critical'), 'assertive');
```

## Known Limitations

1. **Map Component**: The interactive Leaflet map has some inherent accessibility limitations:
   - Complex geographic visualization challenging for screen readers
   - We provide alternative data in the stats panel and analytics dashboard

2. **Real-time Updates**: Frequent data updates may occasionally interrupt screen reader announcements
   - We use polite live regions to minimize disruption

3. **Complex Visualizations**: Chart.js charts in analytics dashboard:
   - We provide data tables as accessible alternatives
   - All data can be exported to CSV

## Future Enhancements

- [ ] Add more language options (Chinese, Korean, Armenian, Tagalog)
- [ ] Voice control integration
- [ ] Tactile/haptic feedback for mobile devices
- [ ] Audio descriptions for complex visualizations
- [ ] Simplified language mode
- [ ] Dyslexia-friendly font option
- [ ] Additional color schemes (protanopia, deuteranopia, tritanopia specific)

## Reporting Issues

If you encounter any accessibility barriers:

1. **GitHub Issues**: https://github.com/yourusername/la-crime-map/issues
2. **Label**: Use the `accessibility` label
3. **Include**:
   - Your assistive technology (screen reader, magnifier, etc.)
   - Browser and version
   - Steps to reproduce
   - Expected vs. actual behavior

## Standards Compliance

### WCAG 2.1 Level AA
- ✅ **Perceivable**: Text alternatives, adaptable content, distinguishable
- ✅ **Operable**: Keyboard accessible, enough time, navigable
- ✅ **Understandable**: Readable, predictable, input assistance
- ✅ **Robust**: Compatible with assistive technologies

### Section 508
- ✅ Compliant with Section 508 standards
- ✅ Compatible with federal accessibility requirements

### ADA Compliance
- ✅ Designed to meet ADA Title II requirements for public services

## Resources

### For Users
- [Accessibility Settings](#) - Access in-app
- [Accessibility Statement](./src/components/AccessibilityStatement.tsx)
- [Keyboard Shortcuts Guide](#)

### For Developers
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [React Accessibility](https://reactjs.org/docs/accessibility.html)

## Acknowledgments

This accessibility implementation follows best practices from:
- W3C Web Accessibility Initiative (WAI)
- The A11Y Project
- WebAIM
- Deque University
- Gov.uk accessibility guidelines

---

**Last Updated**: February 14, 2026

**Maintained By**: LA Crime Map Development Team

**Questions?** See our [Accessibility Statement](./src/components/AccessibilityStatement.tsx) or file an issue on GitHub.
