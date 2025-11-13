# undefined

Task management application with user authentication and full CRUD operations. Features include:

**Authentication**: Email/password authentication using Better Auth, with user-specific task isolation.

**Task Management**: 
- Tasks with title, description, due date, priority (low/medium/high), and status (todo/in-progress/done)
- Full CRUD operations: create, edit, delete tasks
- Mark tasks as complete
- Filter tasks by status and priority
- Each user sees only their own tasks (user-specific task lists)

**Data Models**:
- Users: authentication and profile data
- Tasks: title, description, dueDate, priority, status, userId (for isolation)

**Tech Stack**: TanStack Start frontend with Convex backend and Better Auth for authentication, deployed to Cloudflare Workers.

## Tech Stack

- **Framework**: TanStack Start (React)
- **Backend**: Convex
- **Auth**: Better Auth
- **Styling**: Tailwind CSS v4
- **Deployment**: Cloudflare Workers
- **Package Manager**: Bun
- **CI/CD**: GitHub Actions

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build
```

## Environment Variables

Create a `.env.local` file:

```env
VITE_CONVEX_URL=your_convex_url_here
```

## Deployment

This app is configured for **Cloudflare Workers** deployment with GitHub Actions.

### Automatic Deployment

Every push to the `main` branch automatically deploys via GitHub Actions:

1. Builds with Bun (fast!)
2. Deploys to Cloudflare Workers (edge network)
3. Available at your custom domain

### Manual Deployment

You can also deploy manually using Wrangler:

```bash
# Build the application
bun run build

# Deploy to Cloudflare Workers
bun wrangler deploy
```

### View Deployment Status

Check deployment status at:
```
https://github.com/{{GITHUB_ORG}}/{{GITHUB_REPO}}/actions
```
