from flask import Blueprint, request, redirect, session, url_for
import jwt, datetime, os, requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
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
def google_start():
    """Inizia il flusso OAuth con Google"""
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    if not client_id:
        return {'error': 'Google OAuth not configured'}, 500
    
    redirect_uri = request.host_url.rstrip('/') + '/api/auth/google/callback'
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=openid email profile&"
        f"response_type=code&"
        f"access_type=offline"
    )
    
    return {'auth_url': google_auth_url}

@auth_bp.get('/auth/google/callback')
def google_callback():
    """Gestisce il callback da Google OAuth"""
    code = request.args.get('code')
    if not code:
        return {'error': 'Authorization code not provided'}, 400
    
    client_id = os.getenv('GOOGLE_CLIENT_ID')
    client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {'error': 'Google OAuth not configured'}, 500
    
    # Scambia il code per il token
    token_url = "https://oauth2.googleapis.com/token"
    redirect_uri = request.host_url.rstrip('/') + '/api/auth/google/callback'
    
    token_data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri
    }
    
    try:
        token_response = requests.post(token_url, data=token_data)
        token_json = token_response.json()
        
        if 'error' in token_json:
            return {'error': 'Failed to exchange code for token', 'details': token_json}, 400
        
        # Verifica il ID token
        id_token_str = token_json.get('id_token')
        if not id_token_str:
            return {'error': 'No ID token received'}, 400
        
        # Decodifica e verifica il token ID
        google_user = id_token.verify_oauth2_token(
            id_token_str, google_requests.Request(), client_id
        )
        
        # Trova o crea l'utente
        user = Customer.query.filter_by(email=google_user['email']).first()
        if not user:
            user = Customer(
                email=google_user['email'],
                name=google_user.get('name', ''),
                google_id=google_user['sub']
            )
            db.session.add(user)
            db.session.commit()
        
        # Genera JWT token per la nostra app
        secret = os.getenv('JWT_SECRET', 'dev-jwt')
        payload = {
            'sub': user.id,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        }
        app_token = jwt.encode(payload, secret, algorithm='HS256')
        
        # Redirect al frontend con il token
        frontend_url = os.getenv('FRONTEND_URL', 'https://aurooms.it')
        return redirect(f"{frontend_url}/login-success?token={app_token}")
        
    except Exception as e:
        return {'error': 'Authentication failed', 'details': str(e)}, 500
