# FlowPilot Landing Page

Production marketing site showcasing FlowPilot with an interactive tour powered by FlowPilot itself.

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run dev server
pnpm --filter landing dev

# Build for production
pnpm --filter landing build
```

The landing page runs on **port 3002** by default.

## Features

- **Self-Hosted Tour**: Uses `@flowpilot/react` to power an interactive product tour
- **7-Step Flow**: Guides users through Hero → Features → How It Works → Use Cases → API → FAQ → CTA
- **Next.js 14 App Router**: Static generation for optimal performance
- **shadcn/ui Components**: Built with Radix primitives and Tailwind CSS
- **TypeScript Strict Mode**: Full type safety

## Deployment

### Vercel (Recommended)

1. **Connect Repository**

   ```bash
   # From monorepo root
   vercel
   ```

2. **Configure Build Settings**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/landing`
   - **Build Command**: `cd ../.. && pnpm turbo run build --filter=landing`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

3. **Environment Variables**
   No environment variables required for basic deployment.

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Build

```bash
# From monorepo root
pnpm build

# Serve the built landing app
cd apps/landing
pnpm start
```

The production build outputs to `apps/landing/.next/`.

## Architecture

```
apps/landing/
├── app/
│   ├── layout.tsx          # Root layout with FlowPilotProvider
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/
│   ├── landing-tour.tsx    # FlowPilot tour integration
│   ├── hero-section.tsx
│   ├── how-it-works-section.tsx
│   ├── api-snippet-section.tsx
│   ├── faq-section.tsx
│   └── ...                 # Other sections
└── public/                 # Static assets
```

## Tour Flow

The interactive tour is defined in `components/landing-tour.tsx`:

```typescript
const landingTourFlow: FlowConfig = {
  id: 'landing-tour',
  steps: [
    { id: 'hero', target: '#hero' },
    { id: 'features', target: '#features' },
    { id: 'how-it-works', target: '#how-it-works' },
    { id: 'use-cases', target: '#use-cases' },
    { id: 'api', target: '#api' },
    { id: 'faq', target: '#faq' },
    { id: 'cta', target: '#cta' },
  ],
};
```

Users start the tour by clicking **"Start Interactive Tour"** in the Hero section.

## Performance

- **Bundle Size**: ~115 KB First Load JS
- **Static Generation**: All pages pre-rendered at build time
- **Lighthouse Target**: Performance > 90, Accessibility > 95

## License

See root [LICENSE](../../LICENSE) file.
