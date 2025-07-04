FROM oven/bun:1.2.17-alpine AS builder
# Build ENV arguments
ARG VITE_TELEGRAM_BOT_ID
ARG VITE_TELEGRAM_BOT_NAME
# Set working directory
WORKDIR /app
# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --no-progress
# Build
COPY . .
ENV NODE_ENV=production
RUN bun build:skipchecks

FROM nginx:alpine AS runtime
# Expose port
ENV PORT=80
EXPOSE ${PORT}
# Copy build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy nginx config
COPY deployment/default.conf /etc/nginx/conf.d/default.conf
# HolyHandGrenade!
CMD ["nginx", "-g", "daemon off;"]
