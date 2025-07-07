#!/bin/sh

set -e

errors=""
[ -z "$VITE_TELEGRAM_BOT_ID" ] && errors="$errors\nVITE_TELEGRAM_BOT_ID is required"
[ -z "$VITE_TELEGRAM_BOT_NAME" ] && errors="$errors\nVITE_TELEGRAM_BOT_NAME is required"
[ -n "$errors" ] && { printf "Environment incorrect:%b\n" "$errors"; exit 1; }

envsubst < /usr/share/nginx/html/index.html.template > /usr/share/nginx/html/index.html
rm /usr/share/nginx/html/index.html.template

exec "$@"
