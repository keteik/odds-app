# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /home/node/app

RUN mkdir -p node_modules && chown -R node:node .

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

RUN npm run build

# Stage2: runtime
FROM node:22-alpine AS runtime

ARG APP_PORT
ENV PORT=$APP_PORT

WORKDIR /home/node/app

COPY --from=build /home/node/app/dist ./dist
COPY --from=build /home/node/app/package*.json ./

RUN mkdir -p node_modules && chown -R node:node .

USER node

RUN npm ci --omit=dev

EXPOSE $PORT

CMD ["node", "dist/main.js"]