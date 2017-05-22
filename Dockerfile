FROM ubuntu:16.04

ENV appDir /var/app
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

ENV DEBIAN_FRONTEND teletype

RUN mkdir -p ${appDir}
WORKDIR ${appDir}

add package.json ./
ADD ./app ${appDir}
RUN npm i --production
RUN ls -lah
cmd ["npm", "start"]
