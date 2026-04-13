# Multi-stage Dockerfile for Node.js acquisitions application

FROM node:20-alpine3.20 AS base
RUN apk update && apk upgrade
WORKDIR /app
RUN apk update && apk upgrade tar && apk add --no-cache tar
COPY package*.json ./

FROM base AS development
ENV NODE_ENV=development
RUN npm ci && npm cache clean --force
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS production-deps
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force

FROM node:20-alpine3.20 AS production
RUN apk update && apk upgrade
RUN apk update && apk upgrade tar && apk add --no-cache tar
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-deps /app/node_modules ./node_modules
COPY . .
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"
CMD ["npm", "start"]
