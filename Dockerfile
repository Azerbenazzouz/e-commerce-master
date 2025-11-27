FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Configuration réseau pour éviter les timeouts (comme vu précédemment)
RUN pnpm config set fetch-retries 5
RUN pnpm config set fetch-retry-mintimeout 20000
RUN pnpm config set fetch-retry-maxtimeout 120000

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate

COPY . .


EXPOSE 3000