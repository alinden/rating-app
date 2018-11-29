# Rating App

Webapp to track wins and losses between people playing one-on-one games. ELO ratings are updated after every game to give live player rankings.

## Initial Setup

1. Install sbt, npm, nodejs, nginx, and postgresql
2. Setup nginx to serve static files from `/usr/share/rating-app/public/` and to proxy `/api/` requests to port 8080.
  1. Edit `/etc/nginx/nginx.conf` so that it looks like:
    ```
        location /api/ {
		proxy_pass http://127.0.0.1:8080;
        }

        location / {
            root   /var/www/rating-app/public/;
            index  index.html;
	    try_files $uri $uri/ /index.html;
        }

        location /assets/ {
            root   /var/www/rating-app/public/;
            index  index.html;
        }
     ```
3. Initialize database cluster and create a database named `ratings`.
4. Navigate to `client/rating-app-client/` and install angular: `npm install @angular/cli`
5. Compile the client code: `ng build --prod`
6. Copy compiled output to `/usr/share/rating-app/public`: `sudo cp -r ~/dist/rating-app-client/* /usr/share/rating-app/public`
7. Navigate to `server`.
8. (Optional) Edit `src/main/scala/rating/Main.scala`, adding in the database password.
9. Run `sbt run` - this will download all dependencies the first time it is run.
