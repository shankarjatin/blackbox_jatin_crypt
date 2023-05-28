server {
    listen 80;
    listen [::]:80;
    server_name crypthunt.brlakgec.com www.crypthunt.brlakgec.com;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name crypthunt.brlakgec.com www.crypthunt.brlakgec.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/crypthunt.brlakgec.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/crypthunt.brlakgec.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_ecdh_curve secp384r1;
    ssl_session_timeout 10m;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    # Root and Index Files
    root /var/www/html;
    index index.html index.htm index.nginx-debian.html;

    location / {
        # Proxy to your application
        proxy_pass http://localhost:8000; # Your app's port

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Additional Proxy Settings (if needed)
        # proxy_set_header X-Real-IP $remote_addr;
        # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # proxy_set_header X-Forwarded-Proto $scheme;
    }
}