# This is a Production Dockerfile for a Multi-Container Deployment

# BUILD PHASE
# Use an existing Docker image as a base
FROM node:alpine as builder
WORKDIR /app

# Download and install a dependency
# Add files (package.json and index) to the containers files
COPY ./package.json ./ 
RUN npm install
# this adds only whats required for npm install so that we save time on each rebuild

# Obtain remaining files from image
COPY ./ ./ 

# Tell image what to do on container start
RUN npm run build


# RUN PHASE
FROM nginx
EXPOSE 3000
# Custom Nginx configuration file
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Copy over production assets
COPY --from=builder /app/build ./usr/share/nginx/html 