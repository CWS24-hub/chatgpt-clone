# ChatGPT Clone - Multi-platform AI Chat Application

A comprehensive ChatGPT-like application that runs on Web (Next.js) and Mobile (iOS/Android via Expo/React Native) with multi-language support, RTL layout, Zarinpal billing integration, and paywall functionality.

## Features

- **Multi-platform**: Web (Next.js) and Mobile (Expo/React Native)
- **Multi-language**: English, Persian (Farsi), Arabic with RTL support
- **Billing**: Monthly subscriptions via Zarinpal payment gateway
- **Paywall**: Lockout system for unpaid users with grace period
- **Chat UI**: Streaming OpenAI responses with chat history
- **File Upload**: S3/MinIO integration for file attachments
- **Authentication**: NextAuth.js with Google OAuth

## Tech Stack

### Web
- Next.js 14 (App Router)
- TailwindCSS with RTL support
- NextAuth.js for authentication
- Prisma with PostgreSQL

### Mobile
- Expo (React Native)
- Expo Router for navigation
- Deep linking for billing callbacks

### Shared
- React Native + react-native-web for cross-platform UI
- i18next for internationalization
- Day.js with Jalali calendar support
- OpenAI SDK for AI integration

## Project Structure

```
├── apps/
│   ├── web/               # Next.js web application
│   └── mobile/            # Expo mobile application
├── packages/
│   ├── ui/                # Shared UI components
│   ├── i18n/              # Internationalization
│   ├── core/              # Business logic (payments, OpenAI)
│   └── db/                # Prisma database client
└── package.json           # Monorepo configuration
```

## Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
ALLOWED_MODELS=gpt-4o,gpt-4o-mini,gpt-4.1,gpt-3.5-turbo

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/chatgpt_clone

# Auth
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Storage
S3_ACCESS_KEY_ID=your_s3_access_key
S3_SECRET_ACCESS_KEY=your_s3_secret_key
S3_BUCKET=your_s3_bucket_name
S3_REGION=us-east-1

# Billing
PAYMENT_PROVIDER=zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_CURRENCY=IRT           # IRT (toman) or IRR (rial)
BILLING_PLAN_MONTHLY_ID=basic-monthly
BILLING_AMOUNT_IRR=990000       # store in IRR; convert if IRT
BILLING_GRACE_DAYS=3

# Mobile deep links
DEEPLINK_SCHEME=myapp
DEEPLINK_HOST=billing/callback

# Cron
CRON_SECRET=supersecret
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- OpenAI API key
- Zarinpal merchant account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chatgpt-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (see above)

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out

### Billing
- `POST /api/billing/checkout` - Initiate payment
- `GET /billing/callback` - Payment callback
- `POST /api/billing/reconcile` - Subscription reconciliation

### Chat
- `POST /api/chat/send` - Send message
- `GET /api/chat/list` - Get chat history
- `POST /api/chat/start` - Start new chat

## Mobile Deep Linking

The mobile app supports deep linking for billing callbacks:
- Scheme: `myapp://billing/callback`
- Handles payment completion and subscription activation

## Internationalization

The app supports three languages:
- English (en) - LTR
- Persian (fa) - RTL with Jalali calendar
- Arabic (ar) - RTL with Arabic-Indic numerals

## Billing System

- Monthly subscription model
- Zarinpal payment gateway integration
- Grace period for expired subscriptions
- Automatic reconciliation via cron job

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
