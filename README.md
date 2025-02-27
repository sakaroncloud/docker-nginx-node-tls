# Nginx Docker Node.js App with Load Balancer and Domain Configuration

This project provides a complete setup for a Node.js application using Docker and Nginx. It incorporates a load balancer for distributing traffic across multiple containers, ensuring high availability and scalability. The application is also configured to use a custom domain name.

## Features

- **Dockerized Node.js Application:** Easily deploy your Node.js application in Docker containers.
- **Nginx Reverse Proxy:** Routes incoming traffic to the appropriate containers.
- **Load Balancing:** Efficiently distributes requests between multiple Node.js containers.
- **Custom Domain Integration:** Configured to use a custom domain for better accessibility.
- **Scalable Architecture:** Add more Node.js containers to handle higher traffic loads.

## Technologies

- **Node.js** – The backend application framework.
- **Docker** – Containerizes the Node.js application.
- **Nginx** – Configured as a reverse proxy and load balancer.
- **Load Balancing** – Ensures even distribution of traffic across Node.js instances.
- **Custom Domain** – Configured for easier access and enhanced security.

## Requirements

- Docker & Docker Compose installed on your local machine or server.
- A valid domain name (if you want to configure custom domain access).
- A server (for hosting Docker containers and Nginx).

## Getting Started

Follow the steps below to set up the project locally or on a server.

### Clone the repository

Clone this repository to your local machine or server:

```bash
git clone https://github.com/sakaroncloud/docker-nginx-node-tls.git
cd docker-nginx-node-tls
```

#### Bind Mount
You have to change your volume of configuration file or html file. It depends on operating system and your project directory. 
```bash
For Windows:
❌ F:\docker-nginx-node-tls\nginx\config:/etc/nginx/conf.d
✅ /f/docker-nginx-node-tls/nginx/config:/etc/nginx/conf.d

For Linux/macOS:
✅ /home/docker-nginx-node-tls/nginx/config:/etc/nginx/conf.d

Or you can use absolute path.
✅ ./nginx/config:/etc/nginx/conf.d
```

### Build NodeApp
```bash
cd nodeapp
docker build -t nodeapp:v1 .
```

### Run Docker Compose
Go back to root directory and run one of the following commands
```bash
docker compose up -d --build
or
docker compose -f docker-compose.yml up -d --build
```
### Configure Host Name in your system (Only for Local)
```bash
For Windows: C:\Windows\System32\drivers\etc\hosts  
For Linux: /etc/hosts
```

```bash
Add the following lines to end of hosts file
# NginxJs Tutorial
127.0.0.1 subdomain.example.local
127.0.0.1 example.local
```

## Final Thoughts
This project provides a scalable and efficient solution for deploying a Node.js application using Docker and Nginx. With load balancing, reverse proxy, and custom domain integration, it ensures high availability and seamless traffic distribution. Whether you're deploying locally or on a production server, this setup simplifies the process while maintaining flexibility.

🚀 Start building and scaling your application with ease!

For any questions or improvements, feel free to contribute or reach out. Happy coding! 🎯🔥


## Authors

- [@sakaroncloud](https://www.github.com/sakaroncloud)
