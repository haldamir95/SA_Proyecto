FROM node
COPY node-first node-first/ 
WORKDIR /node-first
RUN npm install
RUN npm install -G nodemon
EXPOSE 3000
CMD ["npm", "start"]
