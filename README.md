# ICN Todo List

A full-stack todo list application built for technical assessment.

## Tech Stack

**Frontend**

- Next.js 15 with TypeScript
- React 19
- Tailwind CSS 4
- shadcn/ui components
- SWR for data fetching
- Zustand for state management

**Backend**

- NestJS with TypeScript
- Fastify
- TypeORM with PostgreSQL
- JWT Authentication
- bcryptjs for password hashing

**Development**

- pnpm workspace (monorepo)
- ESLint & Prettier
- Jest for testing

## Live Demo

- **Frontend**: https://icn-todolist.runeforge.tech
- **Backend API**: https://api.icn.runeforge.tech

## Development Setup

```bash
# Install dependencies
pnpm install

# Run both frontend and backend
pnpm dev

# Or run individually
pnpm dev:frontend
pnpm dev:backend
```

## Project Structure

```
apps/
├── frontend/          # Next.js application
└── backend/           # NestJS API server
```
