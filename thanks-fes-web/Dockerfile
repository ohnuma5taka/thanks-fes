FROM node:18 as node
WORKDIR /app
COPY ./*.json /app/
COPY ./yarn.lock /app/
COPY ./src /app/src/
RUN apt update
RUN apt install gettext-base -y
RUN yarn install --network-timeout 1000000000
RUN yarn build

FROM nginx:stable
RUN apt-get update && apt-get install -y gettext-base
ADD ./default.conf.template /etc/nginx/conf.d/default.conf.template
ARG BACKEND_API_SERVER
RUN sed s/BACKEND_API_SERVER/${BACKEND_API_SERVER}/g /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html
COPY --from=node /app/dist/thanks-fes-web /usr/share/nginx/html

# ENTRYPOINT ["nginx", "-g", "'daemon off;'"]
