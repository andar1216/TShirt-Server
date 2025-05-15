# Use a lightweight Node base image
FROM node:18-alpine

# Set working dir inside the container
WORKDIR /app

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy the rest of your app’s source code
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Start your app
CMD ["npm", "start"]