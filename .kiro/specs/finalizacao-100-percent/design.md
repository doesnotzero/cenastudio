# 🎨 DESIGN - Finalização 100%

**Status**: Draft
**Criado**: 04 Jul 2026
**Baseado em**: `requirements.md`

---

## 🏗️ ARQUITETURA GERAL

### Tech Stack (Atual - Mantém)
```yaml
Frontend:
  - React 18 + TypeScript
  - Vite (build tool)
  - TailwindCSS + shadcn/ui
  - React Router v6
  - Recharts (visualizações)
  - TanStack Query (cache/fetch)

Backend:
  - Node.js + Express
  - TypeScript
  - Prisma ORM
  - SQLite (dev/prod)
  - Zod (validation)

Tests:
  - Vitest (unit)
  - Playwright (e2e) - NEW
  - Testing Library (components)

DevOps:
  - GitHub Actions (CI/CD)
  - Vercel (deploy)
  - Sentry (errors) - NEW
```

---

## 1️⃣ ANALYTICS PREMIUM - DESIGN

### 1.1 Dashboards Customizáveis

#### Database Schema
```prisma
// Adicionar ao schema.prisma

model Dashboard {
  id          String   @id @default(cuid())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  name        String
  description String?
  layout      Json     // { widgets: [...], cols: 12, rowHeight: 80 }
  isDefault   Boolean  @default(false)
  isShared    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}

model Widget {
  id           String   @id @default(cuid())
  dashboardId  String
  dashboard    Dashboard @relation(fields: [dashboardId], references: [id], onDelete: Cascade)
  type         String   // "kpi" | "lineChart" | "barChart" | "pieChart" | "table" | "funnel" | "heatmap" | "gauge"
  title        String
  dataSource   String   // "tickets" | "revenue" | "users" | "proposals"
  config       Json     // Specific to widget type
  position     Json     // { x: 0, y: 0, w: 4, h: 3 }
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([dashboardId])
}
```

#### Component Architecture
```
client/src/
├── pages/
│   └── Analytics/
│       ├── index.tsx              # Main page
│       ├── DashboardBuilder.tsx   # Editor mode
│       └── DashboardView.tsx      # View mode
├── components/
│   └── analytics/
│       ├── DashboardGrid.tsx      # react-grid-layout wrapper
│       ├── WidgetFactory.tsx      # Renders widget by type
│       ├── widgets/
│       │   ├── KPIWidget.tsx
│       │   ├── LineChartWidget.tsx
│       │   ├── BarChartWidget.tsx
│       │   ├── PieChartWidget.tsx
│       │   ├── TableWidget.tsx
│       │   ├── FunnelWidget.tsx
│       │   ├── HeatmapWidget.tsx
│       │   └── GaugeWidget.tsx
│       ├── WidgetConfig.tsx       # Config modal
│       └── WidgetToolbar.tsx      # Add/Remove controls
└── lib/
    └── analytics/
        ├── widgetTypes.ts         # Type definitions
        ├── dataMappers.ts         # Data transformations
        └── layoutUtils.ts         # Grid helpers
```

#### API Endpoints
```typescript
// server/routes/analytics.ts

GET    /api/analytics/dashboards           # List user dashboards
POST   /api/analytics/dashboards           # Create dashboard
GET    /api/analytics/dashboards/:id       # Get dashboard
PUT    /api/analytics/dashboards/:id       # Update dashboard
DELETE /api/analytics/dashboards/:id       # Delete dashboard

GET    /api/analytics/widgets/:id/data     # Get widget data
POST   /api/analytics/widgets              # Add widget
PUT    /api/analytics/widgets/:id          # Update widget
DELETE /api/analytics/widgets/:id          # Delete widget
```

#### Data Flow
```
User Action → DashboardBuilder
  ↓
  ├─ Add Widget → WidgetConfig Modal
  │                  ↓
  │              Select type + dataSource
  │                  ↓
  │              POST /api/analytics/widgets
  │                  ↓
  │              Update Grid Layout
  │
  ├─ Drag Widget → react-grid-layout
  │                  ↓
  │              Update positions
  │                  ↓
  │              PUT /api/analytics/dashboards/:id
  │
  └─ Remove Widget → DELETE /api/analytics/widgets/:id
                        ↓
                     Update Grid Layout
```

#### Libraries to Install
```bash
npm install react-grid-layout
npm install @types/react-grid-layout -D
npm install recharts  # Already installed
npm install date-fns  # Date utilities
```

---

### 1.2 Relatórios Avançados

#### Database Schema
```prisma
model Report {
  id          String   @id @default(cuid())
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  name        String
  type        String   // "sales" | "productivity" | "pipeline" | "roi" | "health"
  filters     Json     // Date range, users, stages, etc
  schedule    Json?    // { frequency: "daily", time: "09:00", recipients: [] }
  lastRun     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId, type])
}

model ReportExecution {
  id         String   @id @default(cuid())
  reportId   String
  report     Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  status     String   // "pending" | "running" | "completed" | "failed"
  result     Json?    // Generated data
  fileUrl    String?  // S3/storage URL
  executedAt DateTime @default(now())

  @@index([reportId])
}
```

#### Component Architecture
```
client/src/pages/Analytics/
├── Reports.tsx                    # Main reports page
├── ReportBuilder.tsx              # Create/edit report
├── ReportViewer.tsx               # View report results
└── ScheduledReports.tsx           # Manage schedules

client/src/components/analytics/reports/
├── ReportTemplates.tsx            # Pre-built templates
├── FilterPanel.tsx                # Advanced filters
├── ExportOptions.tsx              # CSV/Excel/PDF/PPTX
├── ScheduleConfig.tsx             # Schedule setup
└── report-types/
    ├── SalesReport.tsx
    ├── ProductivityReport.tsx
    ├── PipelineReport.tsx
    ├── ROIReport.tsx
    └── HealthReport.tsx
```

#### API Endpoints
```typescript
GET    /api/analytics/reports              # List reports
POST   /api/analytics/reports              # Create report
GET    /api/analytics/reports/:id          # Get report config
PUT    /api/analytics/reports/:id          # Update report
DELETE /api/analytics/reports/:id          # Delete report

POST   /api/analytics/reports/:id/run      # Execute report now
GET    /api/analytics/reports/:id/executions # Get execution history
POST   /api/analytics/reports/:id/schedule # Setup schedule
DELETE /api/analytics/reports/:id/schedule # Remove schedule
```

#### Report Generation Flow
```
User clicks "Generate Report"
  ↓
POST /api/analytics/reports/:id/run
  ↓
Create ReportExecution (status: "pending")
  ↓
Background Job (Bull Queue or simple setTimeout)
  ↓
  ├─ Fetch data based on filters
  ├─ Calculate metrics
  ├─ Generate file (PDF/Excel)
  ├─ Upload to storage (filesystem or S3)
  └─ Update ReportExecution (status: "completed", fileUrl)
  ↓
Frontend polls /api/analytics/reports/:id/executions
  ↓
Show "Download Ready" + link
```

---

### 1.3 Exportação Premium

#### Library Choices
```typescript
// Excel export
import ExcelJS from 'exceljs';

// PDF export (Option 1: Server-side)
import PDFDocument from 'pdfkit';

// PDF export (Option 2: Client-side)
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// PowerPoint export
import PptxGenJS from 'pptxgenjs';
```

#### Export Service Architecture
```typescript
// server/services/ExportService.ts

class ExportService {
  // Excel
  async generateExcel(data: ReportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Summary
    const summary = workbook.addWorksheet('Summary');
    // Add KPIs, formatted cells

    // Sheet 2: Details
    const details = workbook.addWorksheet('Details');
    // Add table data

    // Sheet 3: Charts (as images)
    const charts = workbook.addWorksheet('Charts');
    // Embed chart images

    return await workbook.xlsx.writeBuffer();
  }

  // PDF
  async generatePDF(data: ReportData): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));

    // Header with logo
    doc.image('logo.png', 50, 45, { width: 100 });
    doc.fontSize(20).text(data.title, 200, 50);

    // Content
    doc.moveDown();
    // Add sections, tables, charts

    doc.end();

    return Buffer.concat(buffers);
  }

  // PowerPoint
  async generatePPTX(data: ReportData): Promise<Buffer> {
    const pptx = new PptxGenJS();

    // Slide 1: Title
    const slide1 = pptx.addSlide();
    slide1.addText(data.title, { x: 1, y: 1, fontSize: 44 });

    // Slide 2: KPIs
    const slide2 = pptx.addSlide();
    // Add charts as native objects

    return await pptx.write('buffer');
  }
}
```

#### API Endpoints
```typescript
POST /api/export/excel    # Generate Excel
POST /api/export/pdf      # Generate PDF
POST /api/export/pptx     # Generate PowerPoint
POST /api/export/batch    # Multiple formats in ZIP

// Request body
{
  reportId: string,
  format: 'excel' | 'pdf' | 'pptx',
  options: {
    includeCharts: boolean,
    includeRawData: boolean,
    template: 'modern' | 'corporate' | 'minimal'
  }
}
```

#### Client Component
```typescript
// client/src/components/ExportButton.tsx

export function ExportButton({ reportId, data }) {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleExport = async (format: 'excel' | 'pdf' | 'pptx') => {
    setIsExporting(true);

    // Show progress (fake or real via WebSocket)
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 500);

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        body: JSON.stringify({ reportId, data })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${Date.now()}.${format}`;
      a.click();

      setProgress(100);
    } finally {
      clearInterval(interval);
      setIsExporting(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        Export {isExporting && <Spinner />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          PDF (.pdf)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pptx')}>
          PowerPoint (.pptx)
        </DropdownMenuItem>
      </DropdownMenuContent>

      {isExporting && <Progress value={progress} />}
    </DropdownMenu>
  );
}
```

---

## 2️⃣ POLISH FINAL - DESIGN

### 2.1 Mobile Responsiveness

#### Tailwind Breakpoints Strategy
```typescript
// tailwind.config.js (already configured)
screens: {
  'sm': '640px',   // Mobile landscape / Tablet portrait
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px'  // Extra large
}

// Usage pattern
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
```

#### Mobile Navigation Component
```typescript
// client/src/components/layout/MobileNav.tsx

export function MobileNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Ticket, label: 'Tickets', path: '/tickets' },
    { icon: TrendingUp, label: 'Commercial', path: '/commercial' },
    { icon: FileText, label: 'Proposals', path: '/proposals' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center flex-1 h-full",
              location.pathname === item.path && "text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

#### Responsive Table Pattern
```typescript
// client/src/components/ui/ResponsiveTable.tsx

export function ResponsiveTable({ data, columns }) {
  const isMobile = useMediaQuery('(max-width: 640px)');

  if (isMobile) {
    // Card layout for mobile
    return (
      <div className="space-y-4">
        {data.map(row => (
          <Card key={row.id}>
            <CardHeader>
              <CardTitle>{row.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {columns.map(col => (
                <div key={col.key} className="flex justify-between py-2">
                  <span className="font-medium">{col.label}:</span>
                  <span>{row[col.key]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Regular table for desktop
  return <Table>...</Table>;
}
```

#### Responsive Charts
```typescript
// client/src/components/charts/ResponsiveChart.tsx

export function ResponsiveChart({ data, type }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: window.innerWidth < 640 ? 250 : 400
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <ResponsiveContainer width="100%" height={dimensions.height}>
        {/* Chart component */}
      </ResponsiveContainer>
    </div>
  );
}
```

---

### 2.2 Animações e Microinterações

#### Animation Utilities
```typescript
// client/src/lib/animations.ts

export const animations = {
  // Page transitions
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  },

  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.2 }
  },

  // Interactions
  scaleOnPress: {
    whileTap: { scale: 0.95 },
    transition: { duration: 0.1 }
  },

  hoverLift: {
    whileHover: { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
    transition: { duration: 0.2 }
  }
};

// Respect user preferences
export function useReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

#### Skeleton Loading Component
```typescript
// client/src/components/ui/Skeleton.tsx (already exists in shadcn)
// Usage example:

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
```

#### Count-Up Animation
```typescript
// client/src/components/ui/CountUp.tsx

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export function CountUp({
  end,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = ''
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function
      const easeOutQuad = (t: number) => t * (2 - t);
      const value = end * easeOutQuad(progress);

      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}
```

---

### 2.3 Accessibility (a11y)

#### Keyboard Navigation Setup
```typescript
// client/src/hooks/useKeyboardNav.ts

export function useKeyboardNav(itemsRef: React.RefObject<HTMLElement[]>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const items = itemsRef.current;
      if (!items) return;

      const currentIndex = items.findIndex(el => el === document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          items[(currentIndex + 1) % items.length]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [itemsRef]);
}
```

#### ARIA Patterns
```typescript
// Example: Accessible Modal
export function AccessibleModal({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (isOpen) {
      // Trap focus
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstElement?.focus();

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle id={titleId}>{title}</DialogTitle>
        </DialogHeader>
        <div id={descId}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Color Contrast Checker
```typescript
// client/src/lib/a11y.ts

export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const [rs, gs, bs] = [r, g, b].map(val => {
      val /= 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Usage in dev mode
if (import.meta.env.DEV) {
  const ratio = getContrastRatio('#ffffff', '#000000');
  if (ratio < 4.5) {
    console.warn('Contrast ratio below WCAG AA standard');
  }
}
```

---

### 2.4 Performance Optimization

#### Code Splitting Strategy
```typescript
// client/src/App.tsx

import { lazy, Suspense } from 'react';

// Eager load (critical)
import Layout from './components/layout/Layout';
import Home from './pages/Home';

// Lazy load (non-critical)
const Tickets = lazy(() => import('./pages/Tickets'));
const CommercialHub = lazy(() => import('./pages/CommercialHub'));
const Proposals = lazy(() => import('./pages/Proposals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Projects = lazy(() => import('./pages/Projects'));

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/commercial" element={<CommercialHub />} />
            <Route path="/proposals" element={<Proposals />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
```

#### Image Optimization
```typescript
// client/src/components/ui/OptimizedImage.tsx

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate WebP and fallback
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          className,
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setImageSrc(src)} // Fallback
      />
    </picture>
  );
}
```

#### API Request Deduplication
```typescript
// client/src/lib/api.ts (enhance existing)

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      // Deduplication is automatic with TanStack Query
    }
  }
});

// Use in components
export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => api.getTickets(),
    staleTime: 1000 * 60 * 5
  });
}
```

#### Bundle Size Optimization
```typescript
// vite.config.ts

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk
          'vendor': ['react', 'react-dom', 'react-router-dom'],

          // UI chunk
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],

          // Charts chunk (large)
          'charts': ['recharts', 'react-grid-layout'],

          // Utils chunk
          'utils': ['date-fns', 'clsx', 'zod']
        }
      }
    },

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },

    // Source maps (only for errors)
    sourcemap: 'hidden'
  },

  // Tree shaking
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
```

---

## 3️⃣ E2E TESTS - DESIGN

### 3.1 Playwright Setup

#### Installation & Config
```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 3 : undefined,

  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] }
    }
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
});
```

#### Page Object Model (POM)
```typescript
// e2e/pages/LoginPage.ts

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/');
  }

  async expectError(message: string) {
    await expect(this.page.locator('.error-message')).toContainText(message);
  }
}

// e2e/pages/TicketsPage.ts

export class TicketsPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/tickets');
  }

  async createTicket(data: { title: string; description: string }) {
    await this.page.click('button:has-text("New Ticket")');
    await this.page.fill('[name="title"]', data.title);
    await this.page.fill('[name="description"]', data.description);
    await this.page.click('button:has-text("Create")');

    // Wait for success toast
    await expect(this.page.locator('.toast')).toContainText('Ticket created');
  }

  async getTicketCount() {
    const rows = this.page.locator('table tbody tr');
    return await rows.count();
  }

  async selectTicket(title: string) {
    await this.page.click(`tr:has-text("${title}")`);
  }
}
```

#### Fixtures (Test Data)
```typescript
// e2e/fixtures/users.ts

export const testUsers = {
  admin: {
    email: 'admin@frameai.com',
    password: 'admin123',
    role: 'admin'
  },
  agent: {
    email: 'agent@frameai.com',
    password: 'agent123',
    role: 'agent'
  },
  client: {
    email: 'client@frameai.com',
    password: 'client123',
    role: 'client'
  }
};

// e2e/fixtures/tickets.ts

export const testTickets = [
  {
    title: 'Bug: Login not working',
    description: 'Users cannot login with correct credentials',
    priority: 'high',
    status: 'open'
  },
  {
    title: 'Feature: Add dark mode',
    description: 'Implement dark mode toggle',
    priority: 'medium',
    status: 'in-progress'
  }
];
```

---

### 3.2 Test Suites

#### Authentication Tests
```typescript
// e2e/tests/auth.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testUsers } from '../fixtures/users';

test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await loginPage.expectError('Invalid credentials');
  });

  test('should persist session after refresh', async ({ page }) => {
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await page.reload();
    await expect(page).toHaveURL('/');
  });

  test('should logout successfully', async ({ page }) => {
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');
    await expect(page).toHaveURL('/login');
  });
});
```

#### Ticket Lifecycle Tests
```typescript
// e2e/tests/tickets.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TicketsPage } from '../pages/TicketsPage';
import { testUsers } from '../fixtures/users';

test.describe('Ticket Lifecycle', () => {
  let ticketsPage: TicketsPage;

  test.beforeEach(async ({ page }) => {
    // Login before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testUsers.admin.email, testUsers.admin.password);

    ticketsPage = new TicketsPage(page);
    await ticketsPage.goto();
  });

  test('should create new ticket', async () => {
    const initialCount = await ticketsPage.getTicketCount();

    await ticketsPage.createTicket({
      title: 'E2E Test Ticket',
      description: 'Created by automated test'
    });

    const newCount = await ticketsPage.getTicketCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('should assign ticket to user', async ({ page }) => {
    await ticketsPage.createTicket({
      title: 'Assign Test',
      description: 'Test assignment'
    });

    await ticketsPage.selectTicket('Assign Test');
    await page.click('button:has-text("Assign")');
    await page.click('text=Agent User');

    await expect(page.locator('.assigned-to')).toContainText('Agent User');
  });

  test('should change ticket status', async ({ page }) => {
    await ticketsPage.createTicket({
      title: 'Status Test',
      description: 'Test status change'
    });

    await ticketsPage.selectTicket('Status Test');
    await page.click('[aria-label="Status"]');
    await page.click('text=In Progress');

    await expect(page.locator('.status-badge')).toContainText('In Progress');
  });

  test('should add comment to ticket', async ({ page }) => {
    await ticketsPage.selectTicket('Status Test');

    await page.fill('[placeholder="Add a comment"]', 'This is a test comment');
    await page.click('button:has-text("Post")');

    await expect(page.locator('.comment')).toContainText('This is a test comment');
  });
});
```

---

### 3.3 Visual Regression Tests

```typescript
// e2e/tests/visual.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('homepage desktop', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-desktop.png');
  });

  test('homepage mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });

  test('commercial hub dashboard', async ({ page }) => {
    await page.goto('/commercial');
    await page.waitForSelector('[data-testid="revenue-chart"]');
    await expect(page).toHaveScreenshot('commercial-dashboard.png');
  });

  test('dark mode', async ({ page }) => {
    await page.goto('/');
    await page.click('[aria-label="Toggle theme"]');
    await expect(page).toHaveScreenshot('homepage-dark.png');
  });
});
```

---

### 3.4 CI/CD Integration

```yaml
# .github/workflows/e2e.yml

name: E2E Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    timeout-minutes: 15
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: screenshots
          path: test-results/
          retention-days: 7
```

---

## 4️⃣ PERFORMANCE & BUG FIXES - DESIGN

### 4.1 Lighthouse CI

```javascript
// lighthouserc.js

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173', 'http://localhost:4173/tickets'],
      numberOfRuns: 3
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],

        // Custom budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 300000 }],
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 50000 }],
        'resource-summary:image:size': ['error', { maxNumericValue: 200000 }],

        // Performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### 4.2 Database Optimization

```prisma
// Add indexes to schema.prisma

model Ticket {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  status      String
  priority    String
  assigneeId  Int?
  projectId   Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
  @@index([assigneeId])
  @@index([projectId])
  @@index([createdAt])
  @@index([status, assigneeId]) // Composite for common queries
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      String
  createdAt DateTime @default(now())

  @@index([role])
  @@index([email])
}

model Project {
  id        Int      @id @default(autoincrement())
  name      String
  status    String
  budget    Float
  clientId  Int?
  createdAt DateTime @default(now())

  @@index([status])
  @@index([clientId])
}
```

#### Query Optimization Examples
```typescript
// BAD: Fetches all fields
const tickets = await prisma.ticket.findMany();

// GOOD: Select only needed fields
const tickets = await prisma.ticket.findMany({
  select: {
    id: true,
    title: true,
    status: true,
    assignee: {
      select: {
        id: true,
        name: true
      }
    }
  },
  where: {
    status: 'open'
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 50 // Pagination
});

// BEST: Use raw query for complex aggregations
const stats = await prisma.$queryRaw`
  SELECT
    status,
    COUNT(*) as count,
    AVG(priority) as avg_priority
  FROM Ticket
  WHERE assigneeId = ${userId}
  GROUP BY status
`;
```

---

### 4.3 Error Monitoring Setup

#### Sentry Integration
```typescript
// client/src/main.tsx

import * as Sentry from '@sentry/react';

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay()
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    beforeSend(event, hint) {
      // Filter sensitive data
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      return event;
    }
  });
}
```

```typescript
// server/index.ts

import * as Sentry from '@sentry/node';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 0.1,

    beforeSend(event) {
      // Sanitize sensitive data
      if (event.request?.data) {
        delete event.request.data.password;
        delete event.request.data.token;
      }
      return event;
    }
  });

  // Express error handler
  app.use(Sentry.Handlers.errorHandler());
}
```

---

### 4.4 Memory Leak Prevention

#### Cleanup Checklist
```typescript
// ❌ BAD: Memory leak
function BadComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Running...');
    }, 1000);
    // Missing cleanup!
  }, []);
}

// ✅ GOOD: Proper cleanup
function GoodComponent() {
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Running...');
    }, 1000);

    return () => clearInterval(interval);
  }, []);
}

// ❌ BAD: Event listener leak
function BadListener() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // Missing cleanup!
  }, []);
}

// ✅ GOOD: Remove listener
function GoodListener() {
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
}

// ❌ BAD: Fetch without abort
async function badFetch() {
  const data = await fetch('/api/data');
  // If component unmounts, fetch continues
}

// ✅ GOOD: Use AbortController
function GoodFetch() {
  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/data', { signal: controller.signal })
      .then(res => res.json())
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      });

    return () => controller.abort();
  }, []);
}
```

---

## 📦 DEPENDENCIES TO INSTALL

```json
{
  "dependencies": {
    "react-grid-layout": "^1.4.4",
    "exceljs": "^4.4.0",
    "pdfkit": "^0.14.0",
    "pptxgenjs": "^3.12.0",
    "date-fns": "^3.0.0",
    "@sentry/react": "^7.100.0",
    "@sentry/node": "^7.100.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/react-grid-layout": "^1.3.5",
    "@types/pdfkit": "^0.13.4",
    "lighthouse": "^11.5.0",
    "@lhci/cli": "^0.13.0"
  }
}
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Analytics Premium (3-4 days)
1. Day 1: Database schema + basic dashboard CRUD
2. Day 2: Widget components + grid layout
3. Day 3: Reports system + filtering
4. Day 4: Export (Excel/PDF/PPTX)

### Phase 2: Polish Final (2-3 days)
1. Day 1: Mobile responsive (all pages)
2. Day 2: Animations + accessibility
3. Day 3: Performance optimization

### Phase 3: E2E Tests (2-3 days)
1. Day 1: Playwright setup + auth tests
2. Day 2: Critical flow tests (tickets, commercial)
3. Day 3: Visual regression + CI integration

### Phase 4: Final Polish (1-2 days)
1. Day 1: Lighthouse CI + performance audit
2. Day 2: Bug fixes + final review

---

## ✅ DEFINITION OF DONE

- [ ] All requirements implemented
- [ ] All E2E tests passing
- [ ] Lighthouse scores > targets
- [ ] Zero console errors
- [ ] Zero TypeScript errors
- [ ] Mobile tested (iOS + Android)
- [ ] Accessibility audit passed
- [ ] Performance budget met
- [ ] Documentation updated
- [ ] Deploy to production successful

---

**Status**: ⏳ Aguardando aprovação para iniciar implementação
