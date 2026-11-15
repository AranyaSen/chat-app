# Chat App — Frontend

A minimal chat frontend built with React, TypeScript, Tailwind CSS, TanStack Query, Zustand, and Axios.

The authentication and chat dashboard flows are wired to the Express API. Conversations, history, user search, and profile details come from the backend; no demo conversations or fake users are used.

## Stack

- React 19 + Vite 8 + TypeScript
- Tailwind CSS v4 (`src/styles/globals.css`)
- TanStack Query for server state
- nuqs for URL query state
- Zustand for the persisted auth profile
- React Hook Form + Zod for validation
- Axios for API requests
- Sonner for toasts
- Custom shadcn-style primitives in `src/components/ui`
- Lucide icons

## Getting started

```bash
cd frontend
npm install
npm run dev
```

The dev server runs at **http://localhost:4000**.

Start the backend separately:

```bash
cd backend
npm run dev
```

## Environment and proxy

Copy `.env.example` to `.env` if you need to change the backend origin:

```bash
API_URL=http://localhost:8888
VITE_API_URL=
```

- `API_URL` is used by the Vite dev proxy (`/chat-app` → backend).
- Leave `VITE_API_URL` empty in development. The Axios client uses the relative `/chat-app/api` base so cookies stay same-origin.
- Set `VITE_API_URL` only when the API is deployed on a different origin without a proxy.

The proxy strips the `/chat-app` prefix, so a request to `/chat-app/api/auth/login` reaches the backend at `/api/auth/login`.

## Auth flow

1. `/register` — create an account.
2. `/login` — sign in with username and password.
3. `/verify-email` — unverified accounts receive `403` and a verification email.
4. The email link opens `/verify-email?token=...`, which calls `GET /auth/verify-email`.
5. After verification, sign in and continue to `/app`.

Access and refresh tokens stay in backend httpOnly cookies. Only the profile needed for routing and display is persisted in Zustand.

### Endpoints

| Client call | Endpoint |
| --- | --- |
| `authApi.register` | `POST /auth/register` |
| `authApi.login` | `POST /auth/login` |
| `authApi.verifyEmail` | `GET /auth/verify-email?token=...` |
| `authApi.changeEmail` | `POST /auth/change-email` |
| `authApi.refresh` | `POST /auth/refresh` |
| `authApi.logout` | `POST /auth/logout` |
| `conversationApi.list` | `GET /conversations` |
| `conversationApi.findDirect` | `GET /conversations/direct/:userId` |
| `conversationApi.history` | `GET /conversations/history/:conversationId` |
| `userApi.details` | `GET /user/details` |
| `userApi.search` | `GET /user/search?username=...` |

Protected requests retry once through `/auth/refresh` after a `401`.

## Chat dashboard

`/conversations` shows:

- Profile details refreshed from `GET /user/details` on load
- The conversation list from `GET /conversations`
- Username search with `GET /user/search`
- Direct conversation lookup from `GET /conversations/direct/:userId`
- Message history from `GET /conversations/history/:conversationId`
- Sign out

The selected conversation is stored in the `conversation` query parameter via nuqs.

## Structure

```text
src/
  app/                 App shell, providers, query client
  components/
    feedback/          Loaders and inline alerts
    forms/             Reusable form field wrapper
    layout/            Ambient background
    routing/           Auth-aware route guards
    ui/                Shared UI primitives
  config/
    env.ts             Environment validation and API base URL
  features/
    auth/
      api/             Typed Axios service
      components/      Login, register, verification UI
      hooks/           TanStack mutations
      types/
      utils/
      validation/
    chat/
      api/             Conversation service
      components/      Chat sidebar, conversation list, chat window
      hooks/           Conversation queries and direct lookup
      types/
      utils/
    user/
      api/             User details and search service
      hooks/           User details and search queries
      types/
      utils/
  lib/                 Axios client, formatting, avatar, class helpers
  pages/
    chat/
    login/
    notFound/
    register/
    verifyEmail/
  stores/
    authStore.ts       Persisted auth profile
  styles/globals.css   Design tokens and utilities
```

## Scripts

```bash
npm run dev      # start Vite on :4000
npm run build    # type-check + production build
npm run lint     # ESLint
npm run preview  # preview production build
```

TypeScript is pinned to 6.x for compatibility with the current `typescript-eslint` release.
