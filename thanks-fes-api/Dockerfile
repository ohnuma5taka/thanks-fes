FROM python:3.12-slim-bullseye
ENV PYTHONUNBUFFERED=1

RUN apt update && apt install -y build-essential vim unixodbc redis-server

WORKDIR /src
COPY . .

RUN pip3 install --upgrade pip
RUN echo "setuptools<72" > pip_constraints.txt
ENV PIP_CONSTRAINT=pip_constraints.txt
RUN pip3 install -r requirements.txt
ARG APP_MODE
RUN cp .env.${APP_MODE} .env

EXPOSE 8888

COPY redis.conf /usr/local/etc/redis/redis.conf
RUN mkdir -p /usr/local/etc/redis/logs

CMD service redis-server start && uvicorn main:app --host 0.0.0.0 --port 8888 --workers 16 --ws-ping-interval 25
