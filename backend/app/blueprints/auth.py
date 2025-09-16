from flask import Blueprint, request
import jwt, datetime, os
from .. import db
from ..models import Customer

auth_bp = Blueprint('auth', __name__)

@auth_bp.post('/auth/token')
def simple_token():
    data = request.get_json(force=True)
    if 'email' not in data:
        return {'error': 'email_required'}, 400
    user = Customer.query.filter_by(email=data['email']).first()
    if not user:
        return {'error': 'user_not_found'}, 404
    secret = os.getenv('JWT_SECRET', 'dev-jwt')
    payload = {
        'sub': user.id,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    }
    token = jwt.encode(payload, secret, algorithm='HS256')
    return {'token': token, 'user': user.to_dict()}

@auth_bp.get('/auth/google/start')
def google_start_placeholder():
    return {
        'message': 'Placeholder Google OAuth',
        'next_step': 'Configurare Client ID Google e implementare redirect',
        'configured': bool(os.getenv('GOOGLE_CLIENT_ID'))
    }
