FROM python:3.7

WORKDIR /root/app
RUN apt-get update && apt-get install -y curl git
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.0 python3 - 
ENV PATH $PATH:/root/.local/bin

CMD ["/bin/sh"]
EXPOSE 5000
