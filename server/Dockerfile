# This is a Production Dockerfile
# Use an existing Docker image as a base
FROM node:alpine as builder
WORKDIR /app

# Download and install a dependency
COPY ./package.json ./ 
RUN npm install
# this adds only whats required for npm install so that we save time on each rebuild

# Obtain remaining files from image
COPY ./ ./ 

# Tell image what to do on container start
RUN ["npm", "run", "start"]