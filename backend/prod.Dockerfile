FROM python:3.7-slim

WORKDIR /root/app
RUN apt-get update && apt-get install -y curl
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.2.0 python3 - 
ENV PATH $PATH:/root/.local/bin

COPY pyproject.toml poetry.lock ./
RUN poetry install

COPY . .
CMD ["poetry", "run", "waitress-serve",  "--port=5000", "--call", "flaskr:create_app"]
EXPOSE 5000
