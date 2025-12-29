## =========================
## 0) Dependencies stage (shared)
## =========================

FROM node:24.11.1-slim AS deps

WORKDIR /home/app/gui

RUN npm i -g @angular/cli@20

COPY package*.json ./
RUN npm ci


## =========================
## 1) Development stage
## =========================

FROM node:24.11.1-slim AS development

WORKDIR /home/app/gui

RUN npm i -g @angular/cli@20

## Reuse node_modules from deps stage
COPY --from=deps /home/app/gui/node_modules ./node_modules

## Copy source
COPY . .

EXPOSE 4200

## Dev server (Docker needs 0.0.0.0)
CMD ["bash", "-lc", "npx ng serve --host 0.0.0.0 --port 4200 --poll 2000"]


## =========================
## 2) Build stage
## =========================

FROM node:24.11.1-slim AS build

WORKDIR /home/app/gui

## Reuse node_modules from deps stage
COPY --from=deps /home/app/gui/node_modules ./node_modules

## Copy source
COPY . .

## Build production artifacts
RUN npx ng build --configuration production


## =========================
## 3) Production stage (Nginx)
## =========================

FROM nginx:1.27-alpine AS production

COPY image/nginx.conf /etc/nginx/conf.d/default.conf

ARG APP_NAME=playground-gui
COPY --from=build /home/app/gui/dist/${APP_NAME}/browser/ /usr/share/nginx/html/

EXPOSE 80