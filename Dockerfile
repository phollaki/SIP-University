FROM node:14-alpine
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn install
EXPOSE 3001
CMD "yarn" "start"