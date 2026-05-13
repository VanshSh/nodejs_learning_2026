# Base Image
FROM node:20-alpine

WORKDIR /home/app/

COPY package*.json .
RUN npm install

# Copying the source code to docker image
COPY index.js index.js

COPY Dockerfile Dockerfile

ENV PORT=8000
EXPOSE 8000

CMD [ "npm", "start" ]


// To rename => docker run --name my_node_app_container my_node_app

// Run =>  docker run 79051d1db3a0

// Just to enter into the container =>  docker run -it --rm --entrypoint sh 79051d1db3a0

// To build the image
# If Dockerfile is in a different location
docker build -t your_image_name -f /path/to/Dockerfile .

# With a tag/version
docker build -t your_image_name:v1.0 .

# Without cache (fresh build)
docker build --no-cache -t your_image_name .

// To change the port
docker run -p 8080:8000 your_image_name => [host_port:container_port]

// To run in detached mode (background)
docker run -d -p 8080:8000 your_image_name

// To Expose multiple ports
docker run -p 8080:8000 -p 8081:8001 your

// To automatically expose the port defined in the Dockerfile
docker run -P your_image_name

// For custom network
docker run -itd --network=milkyway --rm --name=my_container busybox

// Connect container for a volumne in the host machine
docker run -v /path/on/host:/path/in/container your_image_name