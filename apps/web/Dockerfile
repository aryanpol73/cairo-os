# Use a lightweight Node image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install
COPY package*.json ./
RUN npm install

# Copy all your frontend code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Start the production server
CMD ["npm", "start"]