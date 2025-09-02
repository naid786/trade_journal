This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Trade Journal / Web Charts

Interactive crypto (or any Binance symbol) charting playground built with Next.js App Router and lightweight-charts. Provides replay, drawing, and basic swing detection for study / journaling workflows.

## Features

- Candlestick chart component: [`ChartComponent`](components/chart.tsx)
- Symbol search (Binance exchangeInfo): [`SelectSymbol`](components/forms/select_symbol.tsx)
- Timeframe switching: [`TimeframeSelector`](components/timeframe_selector.tsx)
- Date range filter: [`DateRangeSelector`](components/ui/date-range-selector.tsx)
- Replay engine (step / play / pause): [`ReplayButton`](components/replay_button.tsx) + [`DraggablePlayWidget`](components/chart/replay_widget.tsx)
- Rectangle drawing tool (custom primitive): [`RectangleDrawingTool`](components/chart/rectangle-drawing-tool.ts)
- Swing high/low marker generation: [`getSwing`](lib/indicator.ts)
- Persisted state store (Zustand + localStorage): [`useChartParams`](provider/use-chart-params.ts)
- UI primitives (Radix + Tailwind v4): components in `components/ui/`
- Utility helpers: [`cn`](lib/utils.ts), [`formatDate`](lib/utils.ts)

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI
- Zustand (state + persistence)
- lightweight-charts (with custom primitives)
- Date utilities: date-fns
- Icon set: lucide-react

## Data Fetching

| Function | File | Description |
|----------|------|-------------|
| [`fetchBinanceOHLC`](data/data.ts) | [data/data.ts](data/data.ts) | Paginates Binance klines until end time. |
| [`fetchBinanceSymbols`](data/data.ts) | [data/data.ts](data/data.ts) | Loads symbol metadata (precision, etc.). |
| Swing markers | [lib/indicator.ts](lib/indicator.ts) | Simple lag-based swing high/low detection. |

Returned OHLC shape (normalized):
```
{
  time: number;      // open time (ms)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number; // close time (ms)
}
```

## Replay Flow

1. User selects start point via replay modal (`ReplayButton`).
2. Data split into:
   - Initial (historic) segment
   - Streaming (future) segment
3. [`ChartComponent.replayChart`](components/chart.tsx) seeds series then animates bars at interval (600ms default).
4. Controls:
   - play/pause: interval start/clear
   - step forward/back: adjust index + redraw
   - close resets via `resetChart`.

## Drawing Tool

The rectangle drawing tool:
- Hooks chart click & crosshair events
- First click = start point, second click = end point
- Live preview uses a temporary primitive
- Final shape attaches a custom primitive extending [`PluginBase`](components/chart/plugin-base.ts)

Extend by creating additional primitives similar to:
- [`rectangle-drawing-tool.ts`](components/chart/rectangle-drawing-tool.ts)
- Shared math helpers: [`positions.ts`](components/chart/positions.ts)

## State

Persisted chart parameter list:
- Store: [`useChartParams`](provider/use-chart-params.ts)
- Key: `cart-storage`
- Add / remove / clear actions

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

Optional package manager alternatives (yarn / pnpm / bun) supported through scripts.

## Scripts

```bash
npm run dev     # Start dev server (Turbopack)
npm run build   # Production build
npm start       # Start production server
npm run lint    # ESLint (flat config)
```

## Directory Highlights

```
app/                Next.js routes & layout
components/         UI + chart + tools
data/               Remote fetch helpers (Binance)
lib/                Utilities & indicators
provider/           Zustand stores
types.ts            Shared TypeScript interfaces
```

## Adding a New Indicator (Example Outline)

1. Create `lib/myIndicator.ts` exporting a function that maps `ChartData[]` → markers or a derived series.
2. Pass markers to [`ChartComponent`](components/chart.tsx) via `markers` prop or attach a new lightweight-charts series inside a wrapper component.
3. (Optional) Add UI toggle in `app/page.tsx`.

## Precision & Formatting

`decimal` from symbol precision drives:
- `priceFormat.minMove`
- Tooltip / crosshair formatting
Adjust in [`ChartComponent`](components/chart.tsx).

## Swing Logic

Current swing detection is naive (lag window). Improve by:
- Using fractal confirmation
- ATR / volatility filters
- Volume validation

Edit in [`getSwing`](lib/indicator.ts).

## Roadmap Ideas

- Multi-symbol watchlist
- Indicator parameter modal
- Persist drawings (serialize rectangle tool state)
- Strategy backtest scaffolding
- WebSocket live updates after initial historical load

## Binance API Notes

- Public endpoints (no key required) but rate-limited.
- For very large ranges the paginator loops until `endTime`.
- Consider caching or server proxy if usage grows.

## Contributing

1. Fork & branch
2. Maintain TypeScript strictness
3. Run `npm run lint` before PR

## License

Add your chosen license (MIT/Apache/etc). Currently unspecified.

## Disclaimer

Educational / journaling tool—no warranty. Always verify data before
