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

### IP アドレスをセット

```
PUBLIC_IP=xxx.xxx.xxx.xxx
```

### モジュールを転送

```
scp -i ~/.ssh/ohnuma5taka.pem thanks-fes.tar.gz ec2-user@${PUBLIC_IP}:~
```

### ssh で入る

```
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@${PUBLIC_IP}
```

### dockerインストール

```
sudo bash install_docker.sh
```

### 解凍 → 移動 → 起動

```
sudo rm -rf thanks-fes && sudo tar xf thanks-fes.tar.gz && cd thanks-fes && sudo docker-compose down && sudo docker rmi thanks-fes-db thanks-fes-api thanks-fes-web && sudo docker-compose up -d && sleep 10 && sudo docker exec -it thanks-fes-api python /src/seed.py
```

### 解答リセット

```
curl -X POST http://${PUBLIC_IP}:8888/init-db
```

```
sudo docker exec -it thanks-fes-api python /src/seed.py
```
