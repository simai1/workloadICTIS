FROM node:20.9.0
WORKDIR /workload-client
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4010
CMD ["npm", "run", "start"]