FROM python:3.8.12-alpine

WORKDIR /root
RUN apk add git vim
# 最新のgithubを取得したい場合はコメントを外す
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" /dev/null
RUN git clone https://github.com/kajikentaro/es-editor
RUN apk add build-base libffi-dev

WORKDIR /root/es-editor/backend
RUN pip install --upgrade pip
RUN pip install -r ./requirements.txt
CMD ["/bin/sh"]

EXPOSE 5000