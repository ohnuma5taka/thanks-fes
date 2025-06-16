from fastapi import APIRouter
from app.routers import panelist_router, question_router, result_router, answer_router, step_router, period_router, team_router

api_router = APIRouter()
api_router.include_router(panelist_router.router, prefix='/panelists', tags=['panelists'])
api_router.include_router(period_router.router, prefix='/periods', tags=['periods'])
api_router.include_router(question_router.router, prefix='/questions', tags=['questions'])
api_router.include_router(answer_router.router, prefix='/answers', tags=['answers'])
api_router.include_router(result_router.router, prefix='/result', tags=['result'])
api_router.include_router(step_router.router, prefix='/step', tags=['step'])
api_router.include_router(team_router.router, prefix='/teams', tags=['teams'])
