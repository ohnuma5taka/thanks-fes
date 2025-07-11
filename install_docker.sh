#! /bin/bash
sudo yum update
sudo yum install -y docker
sudo systemctl start docker
sudo gpasswd -a $(whoami) docker
sudo chgrp docker /var/run/docker.sock
sudo service docker restart
sudo systemctl enable docker
sudo curl -L "https://github.com/docker/compose/releases/download/v2.32.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker -v
docker-compose -v

sudo cp ~/thanks-fes/entrypoint.service /etc/systemd/system/entrypoint.service && \
sudo systemctl daemon-reexec && \
sudo systemctl daemon-reload && \
sudo systemctl enable entrypoint.service
