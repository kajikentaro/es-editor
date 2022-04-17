FROM python:3.8.12-alpine

WORKDIR /root
RUN apk add git vim
RUN apk add build-base libffi-dev
RUN apk add mysql-client
RUN pip install --upgrade pip

COPY . /root/app
WORKDIR /root/app
RUN pip install -e .
RUN pip install waitress
CMD ["waitress-serve",  "--port=5000", "--call", "flaskr:create_app"]
EXPOSE 5000
