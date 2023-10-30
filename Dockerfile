# Use the specified image
# this had trouble with the `yarn install`
# FROM mcr.microsoft.com/devcontainers/typescript-node:1-18-bullseye
# FROM node:18.15.0-alpine
FROM node:18.15.0-bullseye-slim

# Set the working directory
WORKDIR /app

# RUN apk add --no-cache yarn
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++

RUN apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg && \
    curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | gpg --dearmor -o /usr/share/keyrings/doppler-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/doppler-archive-keyring.gpg] https://packages.doppler.com/public/cli/deb/debian any-version main" | tee /etc/apt/sources.list.d/doppler-cli.list && \
    apt-get update && \
    apt-get -y install doppler

# Copy package.json and yarn.lock into the working directory
COPY package.json yarn.lock ./

# Install dependencies using yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the project files into the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000