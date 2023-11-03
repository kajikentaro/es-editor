FROM node:16-slim

ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_GA_TRACKING_ID

COPY package.json /root/app/
COPY yarn.lock /root/app/
WORKDIR /root/app
RUN yarn install --network-concurrency 1

COPY . /root/app
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000
