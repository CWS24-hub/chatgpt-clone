# ChatGPT Clone Monorepo

ChatGPT-style multi-platform application built as a pnpm + Turborepo monorepo. The web client runs on Next.js 14 and the mobile client uses Expo/React Native. Shared packages provide billing, OpenAI streaming, reusable UI, and localisation.

## Features
- Multi-platform chat experience with shared UI primitives across the Next.js web app and Expo mobile app.
- Google OAuth sign-in implemented with NextAuth.js and Prisma, issuing JWT sessions.
- Subscription paywall backed by Zarinpal payments, with invoice tracking and grace-period handling.
- Streaming OpenAI responses with persisted chat history for every conversation.
- Localisation for English, Persian (Farsi), and Arabic, including automatic RTL layout support.
- Type-safe data layer powered by Prisma + PostgreSQL that is reused across apps.

## Tech Stack
**Monorepo**
- pnpm workspaces with Turborepo pipeline orchestration
- TypeScript first across apps and packages

**Web (`apps/web`)**
- Next.js 14 App Router with React 18
- Tailwind CSS with RTL utilities
- NextAuth.js + Prisma adapter for Google OAuth
- Route handlers for chat, billing, and auth flows
- Streaming completions via the official OpenAI Node SDK

**Mobile (`apps/mobile`)**
- Expo SDK 49 / React Native 0.72 with Expo Router 2
- Expo modules for deep linking, secure storage, fonts, and web browser flows
- Shared UI kit consumed via `@workspace/ui` and rendered with react-native-web

**Shared Packages**
- `@workspace/core`: OpenAI helpers, subscription enforcement, and Zarinpal adapter
- `@workspace/db`: Prisma Client singleton with development hot-reload guard
- `@workspace/i18n`: i18next configuration, language resources, and Day.js locale helpers
- `@workspace/ui`: Cross-platform Button/Input/ChatBubble components

## Repository Layout
```
.
|-- apps/
|   |-- mobile/        Expo / React Native client
|   `-- web/           Next.js application
|-- packages/
|   |-- core/          OpenAI + billing domain logic
|   |-- db/            Prisma client wrapper
|   |-- i18n/          Shared localisation resources
|   `-- ui/            Cross-platform UI components
|-- prisma/            Shared Prisma assets (if any)
|-- turbo.json         Turborepo pipeline config
|-- pnpm-workspace.yaml
`-- package.json
```

## Getting Started

### Prerequisites
- Node.js 18 or newer
- pnpm 8+
- PostgreSQL database
- OpenAI API key with access to the configured models
- Google OAuth credentials (web sign-in)
- Zarinpal merchant account details
- Expo CLI plus iOS/Android development tooling for mobile testing

### Installation
1. Clone the repository and install dependencies:
   ```
   pnpm install
   ```
2. Configure environment variables (see below).
3. Push the Prisma schema and generate the client:
   ```
   pnpm turbo run db:push --filter @workspace/web
   pnpm turbo run db:generate --filter @workspace/web
   ```
4. Start the web application:
   ```
   pnpm turbo run dev --filter @workspace/web
   ```
5. In a separate terminal, start the mobile application:
   ```
   pnpm turbo run dev --filter @workspace/mobile
   ```

### Environment Variables

**Web (`apps/web/.env.local`)**
```
# OpenAI
OPENAI_API_KEY=your_openai_api_key
ALLOWED_MODELS=gpt-4o,gpt-4o-mini,gpt-3.5-turbo

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chatgpt_clone

# NextAuth
NEXTAUTH_SECRET=replace_me
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Billing
PAYMENT_PROVIDER=zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_CURRENCY=IRR          # IRR (rial) or IRT (toman)
BILLING_PLAN_MONTHLY_ID=basic-monthly
BILLING_AMOUNT_IRR=990000
BILLING_GRACE_DAYS=3
PAYMENT_WEBHOOK_SECRET=optional_webhook_secret

# Scheduled tasks
CRON_SECRET=supersecret
```

**Mobile (`apps/mobile`)**

Set these before launching Expo (for example via an `.env` file loaded by your shell or by adding them to `app.json` `extra`):
```
EXPO_PUBLIC_API_BASE=http://localhost:3000
EXPO_PUBLIC_DEEPLINK_SCHEME=myapp
EXPO_PUBLIC_DEEPLINK_HOST=billing/callback
```

## API Surface (Web)
- `POST /api/chat/send` - Append a user message and stream the assistant reply (Server-Sent Events).
- `GET /api/chat/list` - Paginated list of a user's chats and latest message.
- `POST /api/billing/checkout` - Create a Zarinpal payment session and return the redirect URL.
- `GET /api/billing/status` - Current subscription status for the signed-in user.
- `POST /api/billing/reconcile` - Cron endpoint to update expired subscriptions (requires `Authorization: Bearer ${CRON_SECRET}`).
- `GET /billing/callback` - Handles the Zarinpal redirect, verifies payment, and activates the subscription.
- `GET/POST /api/auth/[...nextauth]` - NextAuth handler for Google OAuth.

## Mobile Deep Linking
The Expo client listens for the configured scheme (defaults to `myapp://billing/callback`) and refreshes the subscription state after returning from the Zarinpal checkout flow.

## Useful Scripts
- `pnpm turbo run dev --filter <package>` - Start a specific app in development mode.
- `pnpm turbo run build` - Build all workspaces.
- `pnpm turbo run lint` / `pnpm turbo run type-check` - Static analysis for every workspace.
- `pnpm turbo run db:migrate --filter @workspace/web` - Run Prisma migrations when you add schema changes.

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License
This project is licensed under the MIT License.
