# 感謝祭アプリ API

## For Production

```bash
docker build --build-arg APP_MODE=prod -t thanks-fes-api .
docker network create thanks-fes-network
docker run --name thanks-fes-api -itd -p 8888:8888 --network thanks-fes-network --volume ./app:/src/app --tty thanks-fes-api
```

### Seed

```bash
docker exec -it thanks-fes-api python /src/seed.py
```

## For Local

Start Redis

```bash
redis-server redis.conf
```

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Seed

```bash
python seed.py --mode dev
```
