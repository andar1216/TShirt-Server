# Use a lightweight Node base image
FROM node:18-alpine

# Set working dir inside the container
WORKDIR /app

# Copy package files first (leverage Docker cache)
COPY package*.json ./

# Install ALL dependencies (production + dev)
# Needed if you’re using ES Modules or TypeScript
RUN npm install

# Copy rest of app source
COPY . .

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
