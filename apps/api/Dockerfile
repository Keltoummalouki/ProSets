# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps

# ---- Build ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# ---- Development ----
FROM deps AS dev
WORKDIR /app
COPY . .
CMD ["npm", "run", "start:dev"]

# ---- Production ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
