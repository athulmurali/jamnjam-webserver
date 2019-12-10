FROM node:latest
ENV NPM_CONFIG_LOGLEVEL info
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
CMD ["npm", "start"]
