FROM python:3.8.12-alpine

WORKDIR /root
RUN apk add git vim
RUN apk add build-base libffi-dev
RUN pip install --upgrade pip

COPY . /root/app
WORKDIR /root/app
RUN pip install -r ./requirements.txt
CMD ["python", "app.py"]

EXPOSE 5000