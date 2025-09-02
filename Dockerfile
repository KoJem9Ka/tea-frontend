FROM oven/bun:1.2.17-alpine AS builder
# Set working directory
WORKDIR /opt/app
# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
# Build
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM nginx:alpine AS runtime
# Copy nginx config & expose its port
COPY deployment/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Entrypoint
COPY deployment/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
# Copy build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /opt/app/dist /usr/share/nginx/html
# HolyHandGrenade!
CMD ["nginx", "-g", "daemon off;"]
