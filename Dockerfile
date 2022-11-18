FROM node:16 as base

WORKDIR /app

FROM node:16 AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:16 AS production
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci
COPY --from=base /app/build /app/build
RUN npm run build