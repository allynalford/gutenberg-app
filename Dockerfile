# Use a Node.js image that supports ES6 modules
FROM node:16 AS build

WORKDIR /usr/src/app

# Ensure a data folder is created
RUN mkdir -p /usr/src/app/data

# Copy package.json and package-lock.json for npm install
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the necessary port
EXPOSE 3000


# Set the entry point to run the TypeScript file using npm
CMD ["npm", "start"]