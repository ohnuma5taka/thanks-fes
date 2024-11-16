# オールスター感謝祭 Web

## Develop Setup

### Build

```
docker build -t thanks-fes-web $(bash parse_env.sh) .
```

### Run

```
docker run --name thanks-fes-web -itd --env-file .env -p 80:80 --tty thanks-fes-web
```

## Local Setup

1. Initialize

```
yarn
```

2. Serve

```
yarn start:local
```
