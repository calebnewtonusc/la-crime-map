# LA Crime Map Redesign - Testing Guide

## Quick Start

```bash
cd /Users/joelnewton/Desktop/2026-Code/la-crime-map
npm install
npm start
```

The app will open at `http://localhost:3000`

## What to Test

### 1. First Visit Experience
- [ ] Onboarding modal should appear automatically
- [ ] Step through all 5 onboarding steps
- [ ] Click "Skip Tutorial" to verify it closes
- [ ] Refresh page - onboarding should NOT appear again
- [ ] Click info button (i) in header to reopen onboarding

### 2. Theme Toggle
- [ ] App should default to light mode
- [ ] Click sun/moon icon in header to toggle theme
- [ ] Verify all colors change smoothly
- [ ] Refresh page - theme should persist
- [ ] Check both themes look good in all sections

### 3. Color Accessibility
- [ ] Verify legend shows 5 color levels (not 4)
- [ ] Colors should be: blue → light blue → amber → coral → red-purple
- [ ] Each color should have a label AND description
- [ ] Use a colorblind simulator to verify colors are distinguishable

### 4. Data Quality Indicators
- [ ] Header should show quality badge (likely "High Confidence")
- [ ] Badge should be green with checkmark icon
- [ ] Verify it shows sensible data

### 5. LA Average Comparisons
- [ ] Stats panel should show "LA City Average" section
- [ ] Each neighborhood should show comparison badge
- [ ] Verify percentages make sense (e.g., "15% above average")

### 6. Empty States
- [ ] Search for "XYZ123" (nonsense) in search bar
- [ ] Should show empty state with clear message
- [ ] Click "Clear Filters" button to reset
- [ ] Set severity threshold to 50
- [ ] Should show empty state for filters

### 7. Error Handling
To test error states, you can:
- Disconnect from internet
- Or temporarily modify `crimeDataService.ts` to throw error

Expected behavior:
- [ ] Friendly error message appears
- [ ] Technical details in expandable section
- [ ] "Try Again" and "Reset Application" buttons work
- [ ] Troubleshooting tips shown

### 8. Professional Branding
- [ ] Header has map icon logo
- [ ] Title: "LA Crime Map"
- [ ] Subtitle: "Data-driven neighborhood safety insights"
- [ ] Trust signals row shows 3 badges with checkmarks
- [ ] Footer disclaimer is visible and prominent

### 9. Responsive Design

#### Desktop (1024px+)
- [ ] Stats panel floats on right side
- [ ] All controls in one row
- [ ] Comfortable spacing

#### Tablet (768px-1024px)
- [ ] Stats panel smaller but still visible
- [ ] Controls may wrap to 2 rows
- [ ] Trust signals adapt

#### Mobile (< 768px)
- [ ] Stats panel becomes bottom sheet
- [ ] Floating action button (FAB) appears bottom-right
- [ ] Tap FAB to open stats panel
- [ ] Panel slides up from bottom
- [ ] Swipe down or tap X to close
- [ ] Controls stack vertically

### 10. Neighborhood List
Each neighborhood item should show:
- [ ] Neighborhood name
- [ ] Crime count (e.g., "12 per week")
- [ ] Risk badge (e.g., "Low" in blue)
- [ ] Comparison badge (e.g., "15% below average")
- [ ] Colored left border matching risk level

### 11. Map Interactions
- [ ] Hover neighborhood on map → highlights in sidebar
- [ ] Hover neighborhood in sidebar → highlights on map
- [ ] Click neighborhood → shows popup with details
- [ ] Colors on map match new palette

### 12. Footer Disclaimer
- [ ] Yellow background with warning icon
- [ ] Clear disclaimer text
- [ ] Link to LA Open Data Portal
- [ ] "View Tutorial" link in footer meta

### 13. Keyboard Navigation
- [ ] Tab through all controls
- [ ] Focus indicators visible
- [ ] Escape key closes onboarding modal
- [ ] Enter/Space activate buttons

### 14. Time Range Selection
- [ ] Select "Last Week" - data should update
- [ ] Select "Last Month" - data should update
- [ ] Select "Last 3 Months" - data should update
- [ ] Select "Last Year" - data should update
- [ ] Data source text should update with selection

### 15. Analytics Dashboard
- [ ] Click "Analytics Dashboard" tab
- [ ] Charts should render with theme colors
- [ ] Export CSV button should work
- [ ] Charts should be readable in both themes

## Common Issues & Solutions

### Issue: Onboarding doesn't appear
**Solution:** Clear localStorage
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Issue: Theme not changing
**Solution:** Check if theme attribute is set
```javascript
// In browser console:
console.log(document.documentElement.getAttribute('data-theme'));
```

### Issue: Colors still look like traffic lights
**Solution:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Issue: Stats panel not appearing on mobile
**Solution:** Look for floating blue button bottom-right

## Screenshots Checklist

Capture screenshots of:
1. Light mode - map view
2. Dark mode - map view
3. Onboarding modal (step 2 with crime categories)
4. Mobile view with bottom sheet
5. Error state
6. Empty state
7. Analytics dashboard

## Accessibility Testing Tools

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **Colorblind** - Simulate colorblindness
- **WAVE** - Web accessibility evaluation

### Manual Testing
1. Navigate entire app using only keyboard
2. Use screen reader (VoiceOver on Mac, NVDA on Windows)
3. Zoom to 200% - verify layout doesn't break
4. Test with reduced motion preference enabled

### Color Contrast
- Text should meet WCAG AA (4.5:1 minimum)
- Large text should meet WCAG AA (3:1 minimum)
- Use Chrome DevTools > Accessibility panel

## Performance Testing

1. Open Chrome DevTools > Performance
2. Record page load
3. Check for:
   - Fast First Contentful Paint (< 1.5s)
   - Low Cumulative Layout Shift
   - Smooth animations (60fps)

## Regression Testing

After any changes, verify:
- [ ] Map still loads and renders
- [ ] Crime data still fetches
- [ ] All metric buttons work
- [ ] Date range selector works
- [ ] Search functionality works
- [ ] Severity filter works
- [ ] Compare mode works
- [ ] Analytics tab works

## Browser Compatibility

Test in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Limitations

1. **Historical data**: Analytics dashboard uses mock historical data
2. **Real-time updates**: Data is cached, manual refresh needed
3. **Print styles**: Not yet optimized for printing
4. **IE11**: Not supported (uses modern CSS/JS)

## Feedback Collection

When testing with others, ask:
1. Does the onboarding help you understand the tool?
2. Can you distinguish all 5 color levels?
3. Is the disclaimer clear and prominent?
4. Do you trust the data source?
5. Is the mobile experience comfortable?
6. Would you use this to research neighborhoods?

## Sign-off Checklist

Before considering testing complete:
- [ ] All 15 test sections passed
- [ ] Tested in 3+ browsers
- [ ] Tested on mobile device
- [ ] Accessibility audit passes
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Screenshots captured
- [ ] Feedback collected from 2+ testers

## Next Steps After Testing

1. Document any bugs found
2. Create GitHub issues for improvements
3. Collect user feedback
4. Plan next iteration
5. Consider A/B testing key features

---

**Questions?** Review the REDESIGN_SUMMARY.md for detailed information about each feature.
