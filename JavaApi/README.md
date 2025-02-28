mvn clean package

mvn spring-boot:run

http://localhost:8083/swagger-ui/index.html

java -jar target/pd211.jar

mvn clean verify

mvn test

mvn dependency:resolve

mvn clean

java -jar target/pd211.jar --server.port=8083

```
docker build -t pd211-java . 
docker images --all
docker run -it --rm -p 5062:8083 --name pd211_container pd211-java
docker run -d --restart=always --name pd211_container -p 5062:8083 pd211-java
docker run -d --restart=always -v d:/volumes/spring/images:/app/images --name pd211_container -p 5062:8083 pd211-java
docker run -d --restart=always -v /volumes/spring/images:/app/images --name pd211_container -p 5062:8083 pd211-java
docker ps -a
docker stop pd211_container
docker rm pd211_container

docker images --all
docker rmi pd211-java

docker login
docker tag pd211-java:latest novakvova/pd211-java:latest
docker push novakvova/pd211-java:latest

docker pull novakvova/pd211-java:latest
docker ps -a
docker run -d --restart=always -v /volumes/pd211/images:/app/images --name pd211_container -p 5062:8083 novakvova/pd211-java


docker pull novakvova/pd211-java:latest
docker images --all
docker ps -a
docker stop pd211_container
docker rm pd211_container
docker run -d --restart=always --name pd211_container -p 5062:8083 novakvova/pd211-java

---------------/etc/nginx/sites-available/--------------------------

server {
    server_name   slush.itstep.click *.slush.itstep.click;
    location / {
       proxy_pass         http://localhost:5062;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }
}

sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx
```
