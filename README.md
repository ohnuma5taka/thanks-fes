# オールスター感謝祭アプリ

## デプロイ手順

### EC2 インスタンスを用意

- OS：ami-0e68e34976bb4db93
- インスタンスタイプ：t3.xlarge
- キー設定：ohnuma5taka
- セキュリティグループ：既存＞ ec2-default
- EBS：30GiB gp3

### 静的 IP を関連付け

Elastic IP を割り振る

起動中インスタンスに関連付け

### モジュールを圧縮

```
rm -rf thanks-fes/thanks-fes-web/node_modules && rm -rf thanks-fes/thanks-fes-api/venv && for p in $(find . -type d | grep "__pycache__"); do rm -rf $p; done && tar --disable-copyfile -cf thanks-fes.tar.gz thanks-fes
```

### IP アドレスとブランチ名をセット

```
EC2_PUBLIC_IP=xxx.xxx.xxx.xxx
GIT_BRANCH_NAME=20250219_keio_ambassador
```

### モジュールを転送

```
scp -i ~/.ssh/ohnuma5taka.pem ~/.ssh/private_git_id_rsa ec2-user@${EC2_PUBLIC_IP}:~/.ssh/git_id_rsa
sed -i '' "s/__BRANCH_NAME__/${GIT_BRANCH_NAME}/g" setup.sh
scp -i ~/.ssh/ohnuma5taka.pem setup.sh ec2-user@${EC2_PUBLIC_IP}:~/setup.sh
```

### ssh で入る

```
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@${EC2_PUBLIC_IP}
```

### dockerインストール

```
sudo bash setup.sh
```

一度ログアウトして再度ssh

```
exit
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@${EC2_PUBLIC_IP}
```

### 起動

```
cd ~/thanks-fes && \
docker-compose down --rmi all --volumes --remove-orphans && \
docker-compose up -d --build && \
sleep 10 && \
docker exec -it thanks-fes-api python /src/seed.py
```

### 解答リセット

ブラウザアクセス

```
http://${EC2_PUBLIC_IP}:8888/init-db
```

```
sudo docker exec -it thanks-fes-api python /src/seed.py
```
