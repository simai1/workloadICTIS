FROM node:20.9.0
WORKDIR /workload
COPY package*.json /workload
COPY public/ /workload/public
COPY src/ /workload/src
RUN npm install
CMD ["npm", "start"]