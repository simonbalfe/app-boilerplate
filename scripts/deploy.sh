#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

green() { printf "\033[32m%s\033[0m\n" "$1"; }
yellow() { printf "\033[33m%s\033[0m\n" "$1"; }
red() { printf "\033[31m%s\033[0m\n" "$1"; }
bold() { printf "\033[1m%s\033[0m\n" "$1"; }

if [ ! -f "$ENV_FILE" ]; then
  red "No .env file found. Run 'pnpm setup' first."
  exit 1
fi

bold "Deploy"
echo ""
echo "  1) Docker (Railway, Fly.io, VPS)"
echo "  2) Cloudflare Workers"
echo ""
printf "Choose target (1/2): "
read -r TARGET

case "$TARGET" in
  1)
    bold "Building Docker image..."
    cd "$ROOT_DIR"

    source "$ENV_FILE" 2>/dev/null || true

    docker build \
      --build-arg VITE_APP_URL="${VITE_APP_URL:-}" \
      --build-arg VITE_STRIPE_PUBLISHABLE_KEY="${VITE_STRIPE_PUBLISHABLE_KEY:-}" \
      --build-arg VITE_STRIPE_PRICE_ID="${VITE_STRIPE_PRICE_ID:-}" \
      --build-arg VITE_POSTHOG_KEY="${VITE_POSTHOG_KEY:-}" \
      --build-arg VITE_POSTHOG_HOST="${VITE_POSTHOG_HOST:-}" \
      -t tanstack-app .

    green "Docker image built: tanstack-app"
    echo ""
    echo "Run locally:"
    echo "  docker run --env-file .env -p 3000:3000 tanstack-app"
    echo ""
    echo "Push to a registry:"
    echo "  docker tag tanstack-app your-registry/your-app:latest"
    echo "  docker push your-registry/your-app:latest"
    ;;

  2)
    command -v wrangler >/dev/null 2>&1 || { red "wrangler not found. Run: pnpm add -g wrangler"; exit 1; }

    bold "Building for Cloudflare Workers..."
    cd "$ROOT_DIR/apps/web"
    pnpm build

    echo ""
    bold "Setting secrets..."
    yellow "You'll be prompted for each value. Press Enter to skip any you don't need."
    echo ""

    SECRETS=("DATABASE_URL" "BETTER_AUTH_SECRET")
    OPTIONAL_SECRETS=("GOOGLE_CLIENT_ID" "GOOGLE_CLIENT_SECRET" "STRIPE_SECRET_KEY" "STRIPE_WEBHOOK_SECRET" "UPSTASH_REDIS_REST_URL" "UPSTASH_REDIS_REST_TOKEN" "RESEND_API_KEY" "RESEND_FROM")

    source "$ENV_FILE" 2>/dev/null || true

    for SECRET in "${SECRETS[@]}"; do
      VAL="${!SECRET:-}"
      if [ -n "$VAL" ]; then
        printf "Set %s from .env? (Y/n): " "$SECRET"
        read -r CONFIRM
        if [[ ! "$CONFIRM" =~ ^[Nn]$ ]]; then
          echo "$VAL" | npx wrangler secret put "$SECRET"
          green "$SECRET set"
        fi
      else
        red "$SECRET is required but empty in .env. Set it manually:"
        echo "  echo 'your-value' | npx wrangler secret put $SECRET"
      fi
    done

    for SECRET in "${OPTIONAL_SECRETS[@]}"; do
      VAL="${!SECRET:-}"
      if [ -n "$VAL" ]; then
        printf "Set %s from .env? (y/N): " "$SECRET"
        read -r CONFIRM
        if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
          echo "$VAL" | npx wrangler secret put "$SECRET"
          green "$SECRET set"
        fi
      fi
    done

    echo ""
    bold "Deploying..."
    npx wrangler deploy

    green "Deployed to Cloudflare Workers"
    echo ""
    yellow "Set your custom domain in the Cloudflare dashboard:"
    echo "  Workers & Pages > your worker > Settings > Domains & Routes"
    ;;

  *)
    red "Invalid choice"
    exit 1
    ;;
esac
