# Trust Signals & Credibility Components

Comprehensive trust-building components for the LA Crime Map application. These components enhance user confidence through transparency, data sourcing, and clear methodology.

## Overview

This package includes 4 main components designed to build trust and credibility:

1. **DataSources** - Shows where data comes from with live updates
2. **MethodologyModal** - Explains how safety scores are calculated
3. **AboutSection** - Team info, open source badges, and contact
4. **Footer** - Enhanced footer with trust signals (integrated in MainLayout)

## Quick Start

### 1. Import Components

```tsx
import {
  DataSources,
  MethodologyModal,
  AboutSection
} from '@/components/features'
```

### 2. Basic Usage

#### Data Sources Badge (Compact)

Display data freshness and source information inline:

```tsx
<DataSources compact />
```

**Best used:**
- Above maps
- In headers
- Near data visualizations

#### Data Sources Card (Full)

Complete transparency card with update status, processing pipeline, and disclaimers:

```tsx
<DataSources />
```

**Best used:**
- Dedicated "Data" page
- Below main content
- FAQ sections

#### Methodology Modal

Detailed explanation of calculations with formulas and confidence intervals:

```tsx
import { useState } from 'react'
import { MethodologyModal } from '@/components/features'

function YourComponent() {
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  return (
    <>
      <button onClick={() => setMethodologyOpen(true)}>
        View Methodology
      </button>

      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </>
  )
}
```

**Best used:**
- Linked from footer
- FAQ sections
- Near safety scores
- About page

#### About Section

Mission, trust badges, tech stack, and contact information:

```tsx
<AboutSection />
```

**Best used:**
- About page
- Homepage footer section
- Landing pages

## Recommended Integration

### Main Page (app/page.tsx)

```tsx
'use client'

import { useState } from 'react'
import { DataSources, AboutSection, MethodologyModal } from '@/components/features'
import { MapWrapper } from '@/components/map/map-wrapper'

export default function Home() {
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* Compact data badge above map */}
      <DataSources compact />

      {/* Map */}
      <MapWrapper data={data} selectedMetric={metric} />

      {/* Methodology link */}
      <div className="text-center">
        <button
          onClick={() => setMethodologyOpen(true)}
          className="text-purple-600 hover:underline"
        >
          How are safety scores calculated?
        </button>
      </div>

      {/* About section */}
      <AboutSection />

      {/* Modal */}
      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  )
}
```

### Already Integrated

The following are **automatically included** in `MainLayout`:

- Enhanced Footer with trust signals
- MethodologyModal (triggered by footer links)
- Report inaccuracy functionality

No additional code needed for these features!

## Component Details

### DataSources

**Props:**
- `className?: string` - Additional CSS classes
- `compact?: boolean` - Use compact inline badge mode

**Features:**
- Live last-updated timestamp
- Update frequency display
- LAPD Open Data Portal link with logo
- Data processing pipeline visualization
- Accuracy disclaimer
- Methodology link

### MethodologyModal

**Props:**
- `isOpen: boolean` - Modal visibility state
- `onClose: () => void` - Close handler

**Features:**
- Formula breakdown with LaTeX-style equations
- Weighting factors with visual progress bars
- Normalization process explanation
- Confidence intervals methodology
- Known limitations disclosure
- Data quality scoring explanation
- Keyboard accessible (ESC to close)
- Body scroll lock when open

### AboutSection

**Props:**
- `className?: string` - Additional CSS classes

**Features:**
- Mission statement
- 4 trust signal cards (Open Source, Official Data, Transparent, Non-profit)
- GitHub repository link
- API documentation link
- Technology stack badges
- Attribution and credits
- Contact information (email, GitHub issues)
- Responsible use guidelines

### Footer

**Props:**
- `onMethodologyClick?: () => void` - Methodology modal trigger
- `onReportIssueClick?: () => void` - Report issue handler

**Features:**
- Live data update timestamp
- LAPD Open Data source link
- Methodology link
- Report inaccuracy button
- Site navigation
- Legal links
- Important disclaimer
- Open source badge

## Styling

All components use:
- Tailwind CSS utility classes
- Dark mode support (`dark:` variants)
- Responsive design (mobile-first)
- Framer Motion animations
- Lucide React icons
- Custom theme colors from `tailwind.config.ts`:
  - `dark-bg-primary`, `dark-bg-secondary`, `dark-bg-tertiary`
  - `dark-text-primary`, `dark-text-secondary`, `dark-text-tertiary`
  - `neon-cyan`, `neon-purple`, `neon-pink`

## Accessibility

All components include:
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- Semantic HTML
- Color contrast compliance (WCAG AA)

## Customization

### Updating Data Sources

Edit the LAPD Open Data Portal link in `data-sources.tsx`:

```tsx
<a
  href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
  target="_blank"
  rel="noopener noreferrer"
>
```

### Updating GitHub Links

Replace all instances of `https://github.com/yourusername/la-crime-map` with your actual repository URL in:
- `about-section.tsx`
- `footer.tsx`

### Updating Contact Email

Replace `contact@lacrimemap.com` with your actual email in:
- `about-section.tsx`
- `footer.tsx`

### Customizing Methodology

Edit the formulas, weights, and explanations in `methodology-modal.tsx`:

```tsx
// Weighting factors
<WeightBar label="Violent Crime" weight={40} color="bg-red-500" />
<WeightBar label="Break-ins" weight={25} color="bg-orange-500" />
<WeightBar label="Car Theft" weight={20} color="bg-yellow-500" />
<WeightBar label="Petty Theft" weight={15} color="bg-blue-500" />
```

## Live Data Integration

To connect live data updates:

1. Create an API endpoint that returns last update timestamp:

```ts
// app/api/data-status/route.ts
export async function GET() {
  const lastUpdate = await getLastUpdateFromDatabase()
  return Response.json({ lastUpdated: lastUpdate })
}
```

2. Fetch in `DataSources` component:

```tsx
useEffect(() => {
  async function fetchDataStatus() {
    const res = await fetch('/api/data-status')
    const { lastUpdated } = await res.json()
    setLastUpdated(new Date(lastUpdated))
  }
  fetchDataStatus()
}, [])
```

## Performance

- Components use lazy loading where appropriate
- Modal uses AnimatePresence for smooth transitions
- Images have error fallbacks
- No external dependencies beyond project requirements

## Testing

Test methodology modal:
```tsx
import { render, screen } from '@testing-library/react'
import { MethodologyModal } from './methodology-modal'

test('opens and closes methodology modal', () => {
  const handleClose = jest.fn()
  const { rerender } = render(
    <MethodologyModal isOpen={false} onClose={handleClose} />
  )

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  rerender(<MethodologyModal isOpen={true} onClose={handleClose} />)
  expect(screen.getByRole('dialog')).toBeInTheDocument()
})
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - Same as parent project

## Support

For issues or questions:
- GitHub Issues: [Report a bug](https://github.com/yourusername/la-crime-map/issues)
- Email: contact@lacrimemap.com

## Changelog

### v1.0.0 (2025-02-14)
- Initial release
- DataSources component with compact and full modes
- MethodologyModal with complete formula breakdown
- AboutSection with trust badges
- Enhanced Footer with live updates
- Full dark mode support
- Accessibility compliance
