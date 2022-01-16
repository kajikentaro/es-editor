FROM node:16-alpine


COPY . /root/es-manager
WORKDIR /root/es-manager

RUN yarn install -D
RUN yarn add sharp
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000