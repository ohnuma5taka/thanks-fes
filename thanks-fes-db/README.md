# 看護 AI 音声書き起こし・要約アプリ DB

## Env Files

- Place [.env](https://ibm.box.com/s/c8tay1on89dtdlvp1yumoz2yg4tvra63) in project root

## Setup

### Build

```
docker build -t thanks-fes-db .
```

### Run

```
docker network create thanks-fes-network
docker run --name thanks-fes-db -itd --privileged=true -p 50000:50000 --env-file .env --network thanks-fes-network --tty thanks-fes-db
```
