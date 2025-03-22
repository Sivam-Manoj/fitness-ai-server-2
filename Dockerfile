# Use official Node.js v22 (LTS) image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app/src

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port your Express app runs on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
