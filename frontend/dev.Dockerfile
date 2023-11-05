FROM node:16

WORKDIR /root/app
RUN apt-get update && apt-get install -y git
CMD ["/bin/sh"]
EXPOSE 3000
