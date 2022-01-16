FROM node:16-alpine


COPY . /root/es-editor
WORKDIR /root/es-editor

RUN yarn install -D
RUN yarn add sharp
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000