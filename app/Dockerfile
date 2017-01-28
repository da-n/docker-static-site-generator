# Set the base image to Ubuntu
FROM ubuntu:xenial

# File Author / Maintainer
MAINTAINER Daniel Davidson

# Install Node.js and other dependencies
RUN apt-get update && \
    apt-get -y install curl git graphicsmagick && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get -y install python build-essential nodejs

# Install nodemon
RUN npm install -g nodemon gulp node-sass critical gulp-util

# Create a user
RUN useradd -c 'Node.js user' -m -d /home/node -s /bin/bash node
RUN chown -R node:node /home/node
USER node
ENV HOME /home/node

# Install node_modules
ADD ./package.json /home/node/package.json
RUN cd /home/node && \
    npm install

# Define working directory
WORKDIR /home/node
ADD . /home/node

# Expose port
EXPOSE  3000

# Run app using nodemon
CMD ["nodemon", "/home/node/app.js"]
