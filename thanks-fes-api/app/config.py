from datetime import timedelta, timezone
from pydantic_settings import BaseSettings, SettingsConfigDict

tz = timezone(timedelta(hours=+9), 'JST')


class Env(BaseSettings):
    app_mode: str = ''
    allowed_origins: str = '*'
    broadcast_url: str = ''
    db_username: str = ''
    db_password: str = ''
    db_host: str = ''
    db_port: int = 0
    db_database: str = ''
    db_schema: str = ''
    db_ssl_connection: bool = False

    model_config = SettingsConfigDict(env_file=".env")


env = Env()
