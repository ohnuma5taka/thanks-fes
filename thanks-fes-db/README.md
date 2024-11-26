# 感謝祭アプリ DB

## Setup

### Build

```
docker build -t thanks-fes-db .
```

### Run

```
docker network create thanks-fes-network
docker run --name thanks-fes-db -itd --privileged=true -p 5432:5432 --network thanks-fes-network --tty thanks-fes-db
```
