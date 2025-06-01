# Use standard Node.js image for better compatibility
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the dev port (useful if debugging manually)
EXPOSE 5173

# Start the dev server with HMR support
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
