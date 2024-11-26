FROM postgres:latest

COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=Passw0rd
ENV POSTGRES_DB=postgres

USER postgres
WORKDIR /src
