from contextlib import contextmanager
from app.config import env
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

connection_url = 'postgresql://{user}:{password}@{host}:{port}/{database}'.format(
    user=env.db_username,
    password=env.db_password,
    host=env.db_host,
    port=env.db_port,
    database=env.db_database
)

ssl_suffix = ';Security=SSL' if env.db_ssl_connection else ''

engine = create_engine(
    connection_url + ssl_suffix,
    # encoding='utf-8',
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_timeout=5,
)
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def connect_session():
    db = Session()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
