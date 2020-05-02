FROM node:10.0.0 
COPY EJS/node-first api/
WORKDIR /api
RUN apt-get update -y
RUN npm install
RUN npm i express ejs morgan
RUN npm install node-fetch --save
RUN npm i -G nodemon 
RUN npm i body-parser
RUN npm install express-session --save
RUN npm install request
RUN npm i -S alert-node
CMD ["npm", "start"]
