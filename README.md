# Nginx Docker Node.js App with Load Balancer and Domain Configuration

This project provides a complete setup for a Node.js application using Docker and Nginx. It incorporates a load balancer for distributing traffic across multiple containers, ensuring high availability and scalability. The application is also configured to use a custom domain name.

## Features

- **Dockerized Node.js Application:** Easily deploy your Node.js application in Docker containers.
- **Nginx Reverse Proxy:** Routes incoming traffic to the appropriate containers.
- **Load Balancing:** Efficiently distributes requests between multiple Node.js containers.
- **Custom Domain Integration:** Configured to use a custom domain for better accessibility and ssl encryption.
- **Scalable Architecture:** Add more Node.js containers to handle higher traffic loads.

## Technologies

- **Node.js** – The backend application framework.
- **Docker** – Containerizes the Node.js application.
- **Nginx** – Configured as a reverse proxy and load balancer.
- **Load Balancing** – Ensures even distribution of traffic across Node.js instances.
- **Custom Domain** – Configured for easier access and enhanced security.
- **TLS Configuration** – For SSL certificate.

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

### Bind Mounts
In docker compose, you have to map configuration files in local directory with the container directory. It depends on operating system and also with your project directory. 
```bash
For Windows:
❌ F:\docker-nginx-node-tls\nginx\config:/etc/nginx/conf.d
✅ /f/docker-nginx-node-tls/nginx/config:/etc/nginx/conf.d

For Linux/macOS:
✅ /home/docker-nginx-node-tls/nginx/config:/etc/nginx/conf.d

or use relative path
✅ /nginx/config:/etc/nginx/conf.d

Note: You can skip certbot volumes and services for local environment
```

### Build NodeApp
```bash
cd nodeapp
docker build -t nodeapp:v1 .
```
### 🔓 Configure Nginx For Local Deployment
You need to replace .com with .local in local environment.  
❌ example.com  
✅ example.local  
❌ subdomain.example.com  
✅ subdomain.example.local  

```
    # example.local.conf - for simple html or SPA like ReactJs
    server {
        listen 80;
        listen [::]:80;
        server_name example.local;
        server_tokens off;

        root /usr/share/nginx/html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    
```
```
    # subdomain.example.local - for nodeapp
    upstream backend {
        server node1:8000 weight=3;
        server node2:8000 weight=1;
    }

    server {
        listen 80;
        listen [::]:80;
        server_tokens off;
        server_name subdomain.example.local;

        location / {
            # Proxy pass must point to upstream name
            proxy_pass http://backend;

            # Ensure HTTP/1.1 is used for persistent connections
            proxy_http_version 1.1;

            # Pass the original Host header to the backend
            proxy_set_header Host $host;

            # Forward real client IP instead of Nginx's IP (important for logging & auth)
            proxy_set_header X-Real-IP $remote_addr;

            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            # Prevent response caching for dynamic content

            proxy_cache_bypass $http_upgrade;
            proxy_no_cache 1;
            proxy_buffers 16 16k;
            proxy_buffer_size 32k;
        }

    }
```
#### Configure Host Name in your system
```bash
For Windows: C:\Windows\System32\drivers\etc\hosts  
For Linux: /etc/hosts
```

```bash
Add the following lines to end of hosts file
# NginxJs Tutorial
127.0.0.1 example.local
127.0.0.1 subdomain.example.local
```
#### Run docker compose

```bash
docker compose up -d --build
or
docker compose -f docker-compose.yml up -d --build
```

### 🔒 Configure Nginx For Production with SSL
- Step 1 - Rename sample file name correcponding to your domain.  
- Step 2 - Copy the below configuration for Nginx.  
```
# example.com.conf - for simple html or SPA like ReactJs
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    server_tokens off;

    root /usr/share/nginx/html;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

```

```
# subdomain.example.com.conf - for nodeapp
upstream backend {
    server node1:8000 weight=3;
    server node2:8000 weight=1;
}

server {
    listen 80;
    listen [::]:80;
    server_tokens off;
    server_name subdomain.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }

}

```
- Step 3 - Run docker compose before adding SSL configuration in Nginx. By doing so, nginx will not fail to launch and certbot will also be able to ping acme-challenge and generate the certificate.
```bash
docker compose up -d --build
or
docker compose -f docker-compose.yml up -d --build
```

- Step 4 - Now also add SSL configuration to existing Nginx config

```
# example.com.conf - for simple html or SPA like ReactJs
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name example.com www.example.com;
    root /usr/share/nginx/html;
    index index.html index.htm;
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    location / {
        try_files $uri $uri/ /index.html;
    }
     location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
```  

```
# subdomain.example.com.conf - for nodeapp
server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name subdomain.example.com;
   # SSL certificates
    ssl_certificate /etc/letsencrypt/live/subdomain.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/subdomain.example.com/privkey.pem;
    location / {
        # Proxy pass must point to upstream name
        proxy_pass http://backend;

        # Ensure HTTP/1.1 is used for persistent connections
        proxy_http_version 1.1;

        # Pass the original Host header to the backend
        proxy_set_header Host $host;

        # Forward real client IP instead of Nginx's IP (important for logging & auth)
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # Prevent response caching for dynamic content

        proxy_cache_bypass $http_upgrade;
        proxy_no_cache 1;
        proxy_buffers 16 16k;
        proxy_buffer_size 32k;
    }
     location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}

```  

- Step 4 - Finally, SSL certificate is loaded into your Nginx configuration, you can restart nginx

```bash
# Login to Nginx Container
docker exec -it nginx sh

# To test configuration
nginx -t

# To reload
nginx -s reload