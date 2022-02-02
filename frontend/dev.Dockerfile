FROM node:16-alpine

WORKDIR /root
RUN apk add git vim

COPY ./frontend/.env.development ./frontend

WORKDIR /root/es-editor/frontend
CMD ["/bin/sh"]
EXPOSE 3000