FROM node:16-alpine

ARG NEXT_PUBLIC_BACKEND_URL

COPY . /root/app
WORKDIR /root/app

RUN yarn install --network-concurrency 1
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000