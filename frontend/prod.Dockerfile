FROM node:16-alpine

COPY . /root/app
WORKDIR /root/app

RUN yarn install -D
RUN yarn add sharp
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000