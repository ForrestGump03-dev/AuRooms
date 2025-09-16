from flask import Blueprint
from .. import db

health_bp = Blueprint('health', __name__)

@health_bp.get('/health')
def health():
    try:
        db.session.execute('SELECT 1')
        db_ok = True
    except Exception:
        db_ok = False
    return {'status': 'ok', 'database': db_ok}
