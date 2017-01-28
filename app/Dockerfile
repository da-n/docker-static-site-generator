# Set the base image to Ubuntu
FROM ubuntu:xenial

# File Author / Maintainer
MAINTAINER Daniel Davidson

# Install node.js and other dependencies and create node user
RUN apt-get update && \
    apt-get -y install curl git graphicsmagick && \
    curl -sL https://deb.nodesource.com/setup_6.x | bash - && \
    apt-get -y install python build-essential nodejs && \
    npm install -g nodemon gulp node-sass critical gulp-util && \
    useradd -c 'node user' -m -d /home/node -s /bin/bash node && \
    chown -R node:node /home/node

# Change to the node user (prevents volume share issues)
USER node

# Define working directory
ENV HOME /home/node
WORKDIR /home/node

# Expose port
EXPOSE  3000

# Run script
CMD ["/bin/bash", "/home/node/run.sh"]
