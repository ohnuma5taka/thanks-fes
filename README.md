# オールスター感謝祭アプリ

## デプロイ手順

### EC2 インスタンスを用意

- OS：
- インスタンスタイプ：
- EBS：
- キー設定：
- セキュリティタイプ：

### Git 秘密鍵を転送

```
scp -i ~/ohnuma5taka.pem ~/.ssh/my_git_id_rsa ec2-user@__PUBLIC_IP__:~/.ssh/my_git_id_rsa
```

### ssh で入る

```
ssh -i ~/ohnuma5taka.pem ec2-user@__PUBLIC_IP__
```

### git pull

```
ssh -i ~/ohnuma5taka.pem ec2-user@__PUBLIC_IP__
```
