# Docker File for Open Ticket v4
# Use the official Node.js 18 image from Docker Hub
FROM node:18-alpine

# Set a different working directory inside the container
WORKDIR /usr/src/openticket

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code into the container
COPY . .

# Run the bot from index.js
CMD ["node", "index.js"]