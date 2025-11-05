FROM postgres:latest

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres

USER postgres
WORKDIR /src
