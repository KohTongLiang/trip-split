# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the SvelteKit application
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# Copy built application and Prisma files
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Expose the port Cloud Run will use
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["node", "build"]
