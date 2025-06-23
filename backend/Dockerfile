# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.12.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js/Prisma"

# Node.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV PORT=3000

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules (including dev for Prisma CLI)
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application code
COPY . .

# Build your TypeScript into dist/
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Expose the port your server listens on
EXPOSE 3000

# At container start, apply migrations then launch your server
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
