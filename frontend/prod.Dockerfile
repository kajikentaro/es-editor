FROM node:16-alpine

COPY . /root/app
WORKDIR /root/app

RUN yarn install --network-concurrency 1
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000