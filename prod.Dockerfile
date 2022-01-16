FROM node:16-alpine

WORKDIR /root
RUN apk add git vim
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
RUN git clone https://github.com/kajikentaro/es-manager

WORKDIR /root/es-manager
RUN yarn install -D
RUN yarn build

CMD ["yarn", "start"]

EXPOSE 3000