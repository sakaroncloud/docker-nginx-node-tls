#!/bin/bash

# Loop through domains and issue certificates
for DOMAIN in $DOMAIN1 $DOMAIN2; do
  CERT_PATH="/etc/letsencrypt/live/$DOMAIN"
  certbot certonly --webroot -w /var/www/certbot --force-renewal --email techiesakar@gmail.com -d "$DOMAIN"  --agree-tos --non-interactive
done

