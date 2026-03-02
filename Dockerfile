FROM node:20-alpine AS base
WORKDIR /app


FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/common/package.json packages/common/
COPY packages/db/package.json packages/db/


RUN npm ci


# ---------- Build ----------
FROM base AS builder
COPY . .
RUN npm ci
RUN npm run build --workspace=apps/api


# ---------- Production ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "apps/api/dist/index.js"]