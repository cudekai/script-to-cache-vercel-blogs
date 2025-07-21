# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the data directory
COPY data ./data

# Copy the source code directory
COPY src ./src

# Define the command to run your application using the script in the src folder
CMD ["npm", "start"]