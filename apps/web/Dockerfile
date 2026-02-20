# ---- Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# ---- Build ----
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# ---- Development ----
FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ---- Production ----
FROM node:22-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
