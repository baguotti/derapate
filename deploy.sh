#!/bin/bash
# Put DERAPATE online at http://138.68.126.112:8080 (/var/www/derapate on the droplet).
# Super Smash Fioi's experimental build, which used to be on 8080, is on 8081 now.
# Run on your LOCAL machine with everything committed: the droplet gets what is committed.

set -e

DROPLET_IP="138.68.126.112"
SITE_PATH="/var/www/derapate"
# One SSH connection for every step: the droplet drops some new connections (bots keep its SSH busy)
SSH_OPTS="-o ControlMaster=auto -o ControlPath=/tmp/derapate-deploy-%r@%h:%p -o ControlPersist=120 -o ConnectTimeout=10"

if [ -n "$(git status --porcelain)" ]; then
    echo "Commit your changes first: the droplet gets what is committed."; exit 1
fi

echo "=== Building $(git rev-parse --short HEAD) ==="
npm run build

echo "=== Connecting ==="
for attempt in 1 2 3 4 5; do
    ssh $SSH_OPTS root@$DROPLET_IP "mkdir -p $SITE_PATH" && break
    [ $attempt = 5 ] && { echo "Can't reach the droplet."; exit 1; }
    sleep 3
done

echo "=== Uploading the site ==="
rsync -az --delete -e "ssh $SSH_OPTS" dist/ root@$DROPLET_IP:$SITE_PATH/

ssh $SSH_OPTS root@$DROPLET_IP "SITE_PATH=$SITE_PATH bash -s" << 'REMOTE'
set -e
echo "=== Serving it on port 8080 ==="
cat > /etc/nginx/sites-available/derapate << NGINX
server {
    listen 8080;
    server_name _;

    root $SITE_PATH;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
NGINX
ln -sf /etc/nginx/sites-available/derapate /etc/nginx/sites-enabled/

chown -R www-data:www-data "$SITE_PATH"
chmod -R 755 "$SITE_PATH"
nginx -t && systemctl reload nginx
REMOTE

ssh $SSH_OPTS -O exit root@$DROPLET_IP 2> /dev/null || true
echo ""
echo "=== DERAPATE live at http://$DROPLET_IP:8080 ==="
