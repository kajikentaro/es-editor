FROM alpine

WORKDIR /root
RUN apk add git

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
RUN git clone https://github.com/kajikentaro/es-editor

WORKDIR /root/es-editor
