# オールスター感謝祭アプリ

## デプロイ手順

### EC2 インスタンスを用意

- OS：
- インスタンスタイプ：
- EBS：
- キー設定：
- セキュリティタイプ：

### モジュールを転送

```
scp -i ~/.ssh/ohnuma5taka.pem thanks-fes.tar.gz ec2-user@__PUBLIC_IP__:~
```

### ssh で入る

```
ssh -i ~/.ssh/ohnuma5taka.pem ec2-user@__PUBLIC_IP__
```

### 解凍 → 移動 → 起動

```
tar xf thanks-fes.tar.gz && cd thanks-fes && sudo bash install_docker.sh && sudo docker-compose up -d && sleep 10 && sudo docker exec -it thanks-fes-api python /src/seed.py
```
