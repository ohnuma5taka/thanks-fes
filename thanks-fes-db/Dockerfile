FROM ibmcom/db2:11.5.8.0

EXPOSE 50000

ENV LICENSE=accept \
    PERSISTENT_HOME=false \
    DB2INST1_PASSWORD=password \
    DBNAME=bludb

RUN mkdir -p /var/custom
COPY ./scripts/init.sh /var/custom
RUN chmod a+x /var/custom/*

RUN mkdir -p /var/db2inst1
COPY ./scripts/create_table.sql /var/db2inst1
RUN chmod a+x /var/db2inst1/create_table.sql
