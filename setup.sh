#! /bin/bash
BRANCH_NAME=xxx
sudo yum update
sudo yum install -y docker git
sudo systemctl start docker
sudo gpasswd -aG $(whoami) docker
sudo chgrp docker /var/run/docker.sock
sudo service docker restart
sudo systemctl enable docker
sudo curl -L "https://github.com/docker/compose/releases/download/v2.32.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
chmod 400 ~/.ssh/id_rsa
cat << 'EOF' > ~/.ssh/config
Host github.com
    HostName github.com
    IdentityFile ~/.ssh/id_rsa
    User git
EOF
git clone -b $BRANCH_NAME git@github.com:ohnuma5taka/pikmiverse.git
sudo cp thanks-fes/entrypoint.service /etc/systemd/system/entrypoint.service && \
sudo systemctl daemon-reexec && \
sudo systemctl daemon-reload && \
sudo systemctl enable entrypoint.service
