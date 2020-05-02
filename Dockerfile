FROM node:10.0.0 
COPY EJS/node-first api/
WORKDIR /api
RUN apt-get update -y
RUN npm install
CMD ["npm", "start"]
