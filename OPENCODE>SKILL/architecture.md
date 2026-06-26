# FRAME.AI Director Architecture

## High-Level Overview

FRAME.AI Director is a full-stack TypeScript application consisting of:

- **Frontend**: React + Vite (client/)
- **Backend**: Express.js (server/)
- **Database**: SQLite via better-sqlite3 (data/frame.db)
- **AI Integration**: Anthropic (Claude) and/or NVIDIA (Nemotron) for text generation

## Data Flow

```
Browser (React + Vite)
     │  /api/* (credentials: include via cookies)
     ▼
Express Server (server/index.ts)
     ├── Middleware: helmet, cors, rate-limit, cookie-parser, passport (GitHub OAuth)
     ├── Routes: auth, tools, ai, admin, contact, checkout, clients, export, files, collaborators, analytics, video-reviews
     ├── Services: auth, tools, AI (Anthropic/NVIDIA), stripe
     └── Database: SQLite (better-sqlite3)
```

## Key Directories

```
.
├── client/          # React/Vite frontend
│   ├── src/
│   │   ├── pages/   # Page components (routes)
│   │   ├── components/ # Reusable UI components
│   │   ├── lib/     # API client, types, utils
│   │   ├── contexts/ # React context providers
│   │   └── hooks/   # Custom React hooks
│   └── public/      # Static assets
├── server/          # Express backend
│   ├── routes/      # API route definitions
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   ├── middleware/  # Auth, error handling, validation
│   └── models/      # Database initialization
├── shared/          # Shared TypeScript types and constants
│   └── tools.ts     # Definition of the 12 AI tools
├── data/            # SQLite database file
└── uploads/         # User file uploads (stored locally)
```

## Authentication Flow

1. User logs in via `/api/auth/login` (email/password or GitHub OAuth)
2. Server verifies credentials and creates a JWT
3. JWT is stored in an httpOnly cookie named `frame_token`
4. Subsequent requests include this cookie automatically
5. `authenticate` middleware validates the JWT and attaches `req.user`
6. `requireAdmin` middleware checks for admin role

## AI Tool Generation Flow

1. Frontend calls `client/src/lib/api.ts`'s `ai.generate(toolId, input, projectId)`
2. This POSTs to `/api/ai/generate` with `{ toolId, input, projectId }`
3. `aiController.ts` handler:
   - Checks user usage limits via `authService.checkAndIncrementUsage`
   - Delegates to `aiService.generateForTool`
4. `aiService.ts`:
   - Determines AI provider (NVIDIA or Anthropic) from env
   - Validates tool exists and is active via `shared/tools.ts`
   - Constructs system prompt from tool's `promptRole`
   - Generates content using selected AI provider
   - Stores generation in `generations` table
   - Returns `{ output, generationId }`

## Database Schema (SQLite)

Key tables (defined in server/models/db.js):
- `users`: User accounts and authentication
- `tools`: Metadata for the 12 AI tools (seeded from shared/tools.ts)
- `generations`: History of AI tool usages
- `projects`: User projects
- `project_states`: Tool-specific state per project
- `clients`: CRM client records
- `opportunities`: Sales pipeline opportunities
- `interactions`: Customer interaction history
- `collaborators`: Team members
- `project_members`: User-project associations
- `files`: Uploaded files organized by project
- `video_reviews`: Video review projects
- `video_comments`: Comments on video reviews
- `subscriptions`: Stripe subscription data
- `plans`: Subscription plan definitions

## Styling & UI

- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Framer Motion for animations
- Sonner for toast notifications
- Custom design system in client/src/components/ui/