FROM node:16-alpine

WORKDIR /root
RUN apk add git vim

WORKDIR /root/es-editor/
CMD ["/bin/sh"]
EXPOSE 3000