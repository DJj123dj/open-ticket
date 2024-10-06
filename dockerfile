# Use the official Node.js 18 image from Docker Hub
FROM node:18-alpine

# Set a different working directory inside the container (you can change "bot" if needed)
WORKDIR /usr/src/bot

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code into the container
COPY . .

# Expose the port (if needed by the bot)
# EXPOSE 3000

# Run the bot from index.js
CMD ["node", "index.js"]
