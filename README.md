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

```bash
cd /path/to/dist
rm -rf thanks-fes/thanks-fes-web/node_modules && rm -rf thanks-fes/thanks-fes-api/venv && for p in $(find . -type d | grep "__pycache__"); do rm -rf $p; done && tar --disable-copyfile -cf thanks-fes.tar.gz thanks-fes
```

### IP アドレスとブランチ名をセット

```bash
EC2_PUBLIC_IP=57.180.130.247
GIT_BRANCH_NAME=20261114_JASPEHR
```

### モジュールを転送

```bash
scp -i ~/.ssh/ohnuma5taka.pem ~/.ssh/private_git_id_rsa ec2-user@${EC2_PUBLIC_IP}:~/.ssh/git_id_rsa
sed -i '' "s/__BRANCH_NAME__/${GIT_BRANCH_NAME}/g" thanks-fes/setup.sh
scp -i ~/.ssh/ohnuma5taka.pem setup.sh ec2-user@${EC2_PUBLIC_IP}:~/setup.sh
```

### ssh で入る

```bash
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@${EC2_PUBLIC_IP}
```

### dockerインストール

```bash
sudo chown ec2-user:ec2-user ~/.ssh/config && \
chmod 600 ~/.ssh/config && \
sudo usermod -aG docker ec2-user && \
sudo bash setup.sh
```

一度ログアウトして再度ssh

```bash
exit
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@${EC2_PUBLIC_IP}
```

### 起動

```bash
cd ~/thanks-fes && \
docker-compose down --rmi all --volumes --remove-orphans && \
docker-compose up -d --build && \
sleep 10 && \
docker exec -it thanks-fes-api python /src/seed.py
```

### QRコードの生成

https://qr.quel.jp/

```bash
for x in question admin panelist; do echo "http://${EC2_PUBLIC_IP}/#/${x}"
```

### 解答リセット

以下URLでブラウザアクセス：
`http://${EC2_PUBLIC_IP}:8888/init-db`
