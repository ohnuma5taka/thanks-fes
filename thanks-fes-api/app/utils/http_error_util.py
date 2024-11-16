import fastapi
from fastapi import HTTPException


http_status_code = {
    400: fastapi.status.HTTP_400_BAD_REQUEST,
    401: fastapi.status.HTTP_401_UNAUTHORIZED,
    402: fastapi.status.HTTP_402_PAYMENT_REQUIRED,
    403: fastapi.status.HTTP_403_FORBIDDEN,
    404: fastapi.status.HTTP_404_NOT_FOUND,
    405: fastapi.status.HTTP_405_METHOD_NOT_ALLOWED,
    406: fastapi.status.HTTP_406_NOT_ACCEPTABLE,
    407: fastapi.status.HTTP_407_PROXY_AUTHENTICATION_REQUIRED,
    408: fastapi.status.HTTP_408_REQUEST_TIMEOUT,
    409: fastapi.status.HTTP_409_CONFLICT,
    410: fastapi.status.HTTP_410_GONE,
    500: fastapi.status.HTTP_500_INTERNAL_SERVER_ERROR,
    501: fastapi.status.HTTP_501_NOT_IMPLEMENTED,
    502: fastapi.status.HTTP_502_BAD_GATEWAY,
    503: fastapi.status.HTTP_503_SERVICE_UNAVAILABLE,
    504: fastapi.status.HTTP_504_GATEWAY_TIMEOUT,
    505: fastapi.status.HTTP_505_HTTP_VERSION_NOT_SUPPORTED,
    506: fastapi.status.HTTP_506_VARIANT_ALSO_NEGOTIATES,
    507: fastapi.status.HTTP_507_INSUFFICIENT_STORAGE,
    508: fastapi.status.HTTP_508_LOOP_DETECTED,
    509: fastapi.status.HTTP_510_NOT_EXTENDED,
}


def raise_http_exception(code: int, message: str):
    raise HTTPException(status_code=http_status_code[code], detail=message)
