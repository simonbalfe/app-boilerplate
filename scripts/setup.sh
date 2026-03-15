#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"
ENV_EXAMPLE="$ROOT_DIR/.env.example"

green() { printf "\033[32m%s\033[0m\n" "$1"; }
yellow() { printf "\033[33m%s\033[0m\n" "$1"; }
red() { printf "\033[31m%s\033[0m\n" "$1"; }
bold() { printf "\033[1m%s\033[0m\n" "$1"; }

bold "TanStack Start Boilerplate Setup"
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { red "Node.js is required. Install it from https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { red "pnpm is required. Run: corepack enable && corepack prepare pnpm@9.15.0 --activate"; exit 1; }

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  red "Node.js 20+ required (you have $(node -v))"
  exit 1
fi

green "Prerequisites OK (Node $(node -v), pnpm $(pnpm -v))"
echo ""

# Create .env if it doesn't exist
if [ -f "$ENV_FILE" ]; then
  yellow ".env already exists. Skipping env setup."
  yellow "Delete .env and re-run this script to start fresh."
  echo ""
else
  cp "$ENV_EXAMPLE" "$ENV_FILE"

  # Generate BETTER_AUTH_SECRET automatically
  SECRET=$(openssl rand -base64 32)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$SECRET|" "$ENV_FILE"
  else
    sed -i "s|^BETTER_AUTH_SECRET=.*|BETTER_AUTH_SECRET=$SECRET|" "$ENV_FILE"
  fi
  green "Generated BETTER_AUTH_SECRET"

  # Set default app URL
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^VITE_APP_URL=.*|VITE_APP_URL=http://localhost:3000|" "$ENV_FILE"
  else
    sed -i "s|^VITE_APP_URL=.*|VITE_APP_URL=http://localhost:3000|" "$ENV_FILE"
  fi

  # Prompt for DATABASE_URL
  echo ""
  bold "Database URL"
  echo "You need a PostgreSQL connection string."
  echo "Get a free one at https://neon.tech in about 30 seconds."
  echo ""
  printf "Paste your DATABASE_URL: "
  read -r DB_URL

  if [ -z "$DB_URL" ]; then
    yellow "No DATABASE_URL provided. You'll need to add it to .env before running."
  else
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|^DATABASE_URL=.*|DATABASE_URL=$DB_URL|" "$ENV_FILE"
    else
      sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$DB_URL|" "$ENV_FILE"
    fi
    green "DATABASE_URL set"
  fi

  echo ""
  green ".env created with required values"

  # Optional: Google OAuth
  echo ""
  printf "Set up Google OAuth now? (y/N): "
  read -r SETUP_GOOGLE
  if [[ "$SETUP_GOOGLE" =~ ^[Yy]$ ]]; then
    printf "GOOGLE_CLIENT_ID: "
    read -r GCID
    printf "GOOGLE_CLIENT_SECRET: "
    read -r GCSECRET
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GCID|" "$ENV_FILE"
      sed -i '' "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GCSECRET|" "$ENV_FILE"
    else
      sed -i "s|^GOOGLE_CLIENT_ID=.*|GOOGLE_CLIENT_ID=$GCID|" "$ENV_FILE"
      sed -i "s|^GOOGLE_CLIENT_SECRET=.*|GOOGLE_CLIENT_SECRET=$GCSECRET|" "$ENV_FILE"
    fi
    green "Google OAuth configured"
  else
    yellow "Skipped Google OAuth (email/password auth still works)"
  fi
fi

# Install dependencies
echo ""
bold "Installing dependencies..."
cd "$ROOT_DIR"
pnpm install

# Push database schema
echo ""
DB_URL_SET=$(grep "^DATABASE_URL=" "$ENV_FILE" | cut -d= -f2-)
if [ -n "$DB_URL_SET" ]; then
  bold "Pushing database schema..."
  pnpm db:push
  green "Database tables created"
else
  yellow "Skipping db:push (no DATABASE_URL set). Run 'pnpm db:push' after adding it."
fi

# Done
echo ""
echo "=========================================="
green "Setup complete!"
echo "=========================================="
echo ""
echo "  pnpm dev     Start the dev server"
echo "  pnpm db:studio    Browse your database"
echo "  localhost:3000/api/docs    API documentation"
echo ""
yellow "Optional services (add to .env when ready):"
echo "  Resend     Email verification + password reset"
echo "  Stripe     Payments (+ Upstash Redis for caching)"
echo "  PostHog    Analytics"
echo "  Sentry     Error tracking"
echo ""
