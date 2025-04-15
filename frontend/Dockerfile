# Use official Node.js image
FROM node:23

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]