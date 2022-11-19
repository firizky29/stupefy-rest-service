FROM node:16 as base

WORKDIR /app

FROM node:16-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

FROM node:16-alpine AS production
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm i
COPY --from=base /app/build /app/build
RUN npm run build