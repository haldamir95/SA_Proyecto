FROM node
COPY node-first node-first/ 
WORKDIR /node-first
RUN npm install
RUN npm install -G nodemon
EXPOSE 3000
CMD ["npm", "start"]




//JALO A LA PRIMERA CON ANNELICE
FROM node:10.0.0 
COPY NODEJS/api api/
WORKDIR /api
RUN apt-get update -y
RUN apt-get install nano -y
# RUN apt-get install inetutils-ping -y
RUN apt-get install unzip -y
RUN npm install gulp -g
RUN npm install
CMD ["npm", "start"]
