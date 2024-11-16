# 感謝祭アプリ API

## Env Files

- Place `.env` in project root
```aiignore
# APP
APP_MODE=prod

# API
ALLOWED_ORIGINS=*

# DB
DB_USERNAME=db2inst1
DB_PASSWORD=password
DB_DATABASE=bludb
DB_HOST=thanks-fes-db
DB_PORT=54321
DB_SCHEMA=thanks_fes
DB_SSL_CONNECTION=False
```

## Production Setup

### Build

```
docker build --build-arg APP_MODE=prod -t thanks-fes-api .
```

### Run


```
docker network create thanks-fes-network
docker run --name thanks-fes-api -itd -p 8888:8888 --network thanks-fes-network --volume ./app:/src/app --tty thanks-fes-api
```

## Local Setup

### 1. Install Modules

```
pip install -r requirements.txt
```

### 2. Serve

```
pythom main.py
```

## Seed

```
docker exec -it thanks-fes-api python /src/seed.py
```
