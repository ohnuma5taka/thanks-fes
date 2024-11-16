from sqlalchemy.ext.declarative import declarative_base, declared_attr


class CustomBase(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    def dict(self):
        model = {}
        for column in self.__table__.columns:
            model[column.name] = str(getattr(self, column.name))
        return model


Base = declarative_base(cls=CustomBase)
