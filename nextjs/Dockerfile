# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json, package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the entire application
COPY . .

# Ensure .env.local is available inside the container
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "run", "start"]
