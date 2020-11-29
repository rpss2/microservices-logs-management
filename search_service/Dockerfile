FROM node:slim

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .
COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["yarn", "start"]