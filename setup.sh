#! /bin/bash
BRANCH_NAME=__BRANCH_NAME__
sudo yum update
sudo yum install -y docker git
sudo systemctl start docker
sudo usermod -aG docker $(whoami)
sudo chgrp docker /var/run/docker.sock
sudo service docker restart
sudo systemctl enable docker
sudo curl -L "https://github.com/docker/compose/releases/download/v2.32.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
cd /home/ec2-user
chmod 400 .ssh/git_id_rsa
set -e
cat << 'EOF' > .ssh/config
Host github.com
    HostName github.com
    IdentityFile /home/ec2-user/.ssh/git_id_rsa
    User git
EOF
chmod 600 .ssh/config
sudo -u ec2-user git clone -b $BRANCH_NAME git@github.com:ohnuma5taka/thanks-fes.git && \
sudo cp thanks-fes/entrypoint.service /etc/systemd/system/entrypoint.service && \
sudo systemctl daemon-reexec && \
sudo systemctl daemon-reload && \
sudo systemctl enable entrypoint.service
