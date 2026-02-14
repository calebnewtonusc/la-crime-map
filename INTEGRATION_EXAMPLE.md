# Quick Integration Example

## How to Integrate Trust Features into Your LA Crime Map

### Option 1: Simple Integration (Recommended)

Replace your current `index.tsx` to use the Router:

```typescript
// /src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Router';  // Import the new Router
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

// Service worker registration
serviceWorkerRegistration.register();
reportWebVitals();
```

That's it! The Router component handles everything:
- Navigation between pages
- Footer integration
- Page titles
- Browser history

### Option 2: Manual Integration

If you want more control, update your `AppWrapper.tsx`:

```typescript
import React, { useState } from 'react';
import App from './App';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import About from './pages/About';
import DataSources from './pages/DataSources';
import Disclaimers from './pages/Disclaimers';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';

type Page = 'map' | 'about' | 'data-sources' | 'disclaimers' | 'faq' | 'contact' | 'privacy';

const AppWrapper: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('map');
  const [lastDataUpdate] = useState(new Date());

  const renderPage = () => {
    switch (currentPage) {
      case 'about': return <About />;
      case 'data-sources': return <DataSources />;
      case 'disclaimers': return <Disclaimers />;
      case 'faq': return <FAQ />;
      case 'contact': return <Contact />;
      case 'privacy': return <Privacy />;
      default: return <App />;
    }
  };

  return (
    <>
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      {currentPage !== 'map' && (
        <Footer onNavigate={setCurrentPage} lastDataUpdate={lastDataUpdate} />
      )}
    </>
  );
};

export default AppWrapper;
```

### Add Tooltips to App.tsx

Find your metric selector buttons and wrap the labels:

```typescript
import Tooltip from './components/Tooltip';

// In your metric selector:
<button
  className={selectedMetric === 'violentCrime' ? 'active' : ''}
  onClick={() => setSelectedMetric('violentCrime')}
>
  <Tooltip
    content="Includes assault, robbery, rape, homicide, kidnapping, and weapons incidents. Excludes simple battery without weapon."
    position="bottom"
  >
    <span>Violent Crime</span>
  </Tooltip>
</button>

<button
  className={selectedMetric === 'carTheft' ? 'active' : ''}
  onClick={() => setSelectedMetric('carTheft')}
>
  <Tooltip
    content="Stolen vehicles and attempted vehicle theft. Does not include theft FROM vehicles."
    position="bottom"
  >
    <span>Car Theft</span>
  </Tooltip>
</button>

<button
  className={selectedMetric === 'breakIns' ? 'active' : ''}
  onClick={() => setSelectedMetric('breakIns')}
>
  <Tooltip
    content="Residential and commercial burglary. Vehicle burglary is categorized as petty theft."
    position="bottom"
  >
    <span>Break-ins</span>
  </Tooltip>
</button>

<button
  className={selectedMetric === 'pettyTheft' ? 'active' : ''}
  onClick={() => setSelectedMetric('pettyTheft')}
>
  <Tooltip
    content="Includes theft, shoplifting, vehicle burglary, pickpocketing, purse snatching, and embezzlement."
    position="bottom"
  >
    <span>Petty Theft</span>
  </Tooltip>
</button>
```

### Add Data Quality Badge to Header

In `App.tsx`, add to your header:

```typescript
import DataQualityBadge from './components/DataQualityBadge';

// In your header section, after the "Data: {dataSource}" line:
<div className="data-quality-container" style={{ marginTop: '0.5rem' }}>
  <DataQualityBadge
    confidence={dataSource.includes('Real LA Crime Data') ? 'high' : 'medium'}
    lastUpdated={new Date().toLocaleDateString()}
    showDetails={true}
  />
</div>
```

### Add "How We Calculate This" to Stats Panel

In the stats panel neighborhood list items:

```typescript
<Tooltip
  content={`This shows ${n[selectedMetric]} incidents per week based on LAPD data. Click About to learn our calculation method.`}
  position="left"
>
  <span className="crime-value">{n[selectedMetric] || 0} per week</span>
</Tooltip>
```

## Quick Start Checklist

After integrating:

1. **Test Navigation**
   - Click through all nav links
   - Test mobile menu (resize browser)
   - Use browser back/forward buttons

2. **Verify Footer**
   - Should appear on all trust pages
   - Should NOT appear on map page (already has its own footer)
   - All footer links should work

3. **Check Tooltips**
   - Hover over metric names
   - Hover over crime values
   - Check mobile behavior (tap to show)

4. **Test Data Quality Badge**
   - Should show when data loads
   - Should update when data refreshes
   - Tooltip should explain quality level

5. **Mobile Responsiveness**
   - Test on phone screen width
   - Navigation menu should collapse
   - All trust pages should be readable
   - Forms should work on mobile

## Common Issues & Fixes

### Navigation doesn't work
- Make sure you're using the `onNavigate` prop correctly
- Check that state is updating
- Verify Router.tsx is imported properly

### Footer appears on map page
- Add conditional rendering: `{currentPage !== 'map' && <Footer />}`
- Or handle it in the Router component

### Tooltips don't show
- Import Tooltip component
- Wrap content in Tooltip component
- Check CSS is imported

### Pages have no styling
- Import `TrustPages.css` in each trust page component
- Check that CSS files are in correct locations

### Mobile menu doesn't close
- Ensure `setMobileMenuOpen(false)` is called in handleNavigate
- Check that state is being updated

## Customization

### Change Colors
Edit `/src/pages/TrustPages.css`:
- Primary: `#667eea` (purple gradient)
- Accent: `#764ba2`
- Links: `#90cdf4` (blue)

### Change Navigation Style
Edit `/src/components/Navigation.css`:
- Background gradient
- Active state colors
- Hover effects

### Add Your Branding
- Update logo/icon in Navigation
- Add your organization name to Footer
- Customize About page with your story

### Add Social Links
In Footer.tsx, add a new section:
```typescript
<div className="footer-section">
  <h4>Connect</h4>
  <div className="social-links">
    <a href="https://twitter.com/..." target="_blank" rel="noopener noreferrer">Twitter</a>
    <a href="https://github.com/..." target="_blank" rel="noopener noreferrer">GitHub</a>
  </div>
</div>
```

## That's It!

You now have a professional, trustworthy crime mapping application with:
- ✓ Complete transparency
- ✓ Legal protection
- ✓ User trust features
- ✓ Professional appearance
- ✓ Mobile-friendly design
- ✓ Comprehensive documentation

The application goes from looking like a scam to looking like a legitimate civic technology project!
