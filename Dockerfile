FROM node:10

COPY . /srv
WORKDIR /srv
RUN npm install
EXPOSE 3000

CMD [ "node", "bin/www" ]