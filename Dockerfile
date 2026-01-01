# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

ENV PUBLIC_SUPABASE_URL="https://build-placeholder.com"
ENV PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY="build-placeholder-key"

# Build the SvelteKit application
RUN npx svelte-kit sync && npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy built application and Prisma files
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose the port
EXPOSE 3000

ENV HOST=0.0.0.0

# Start the application
CMD ["node", "build/index.js"]
