FROM node:10.0.0 
COPY node-first node-first/
WORKDIR /node-first
RUN apt-get update -y
RUN apt-get install nano -y
RUN apt-get install inetutils-ping -y
RUN npm install
CMD ["npm", "start"]
