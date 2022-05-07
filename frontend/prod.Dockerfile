FROM node:16-alpine

ARG NEXT_PUBLIC_BACKEND_URL

ADD package*.json /root/app/
WORKDIR /root/app
RUN yarn install --network-concurrency 1

COPY . /root/app
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000