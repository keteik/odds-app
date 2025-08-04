FROM node:22-alpine

ARG APP_PORT
ENV PORT=$APP_PORT

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN chown -R node:node package*.json

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE $PORT

CMD ["npm", "run", "build"]

CMD ["npm", "run", "start:prod"]