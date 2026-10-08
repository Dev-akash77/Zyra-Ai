# ?==================STAGE 1:BASE==========================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ?==================STAGE 2:DEVELOPMENT==========================
FROM base AS development
RUN npm install --legacy-peer-deps
COPY . .
CMD [ "npm","run","start:dev" ]


# ?==================STAGE 3:BUILD================================
FROM development AS build
RUN npm run build
RUN npm ci --omit=dev --legacy-peer-deps && npm cache clean --force


# ?==================STAGE 4:PRODUCTION================================
FROM node:20-alpine AS production
WORKDIR /app
USER node
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./

# ? APP PORT
EXPOSE 5000

CMD ["node","dist/main"]