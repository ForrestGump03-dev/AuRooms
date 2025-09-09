from flask import Flask, request, jsonify, redirect, session, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from authlib.integrations.flask_client import OAuth
import jwt
import os
import datetime
import re
from functools import wraps
import stripe
import hashlib
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))

# Database configuration 
database_url = os.environ.get('DATABASE_URL')
if database_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback per sviluppo locale
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///aurooms.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS configuration per permettere richieste dal frontend su Netlify
CORS(app, origins=["https://aurooms.it", "http://localhost:3000", "http://127.0.0.1:5500"], 
     supports_credentials=True)

db = SQLAlchemy(app)

# Configurazione OAuth Google
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Configurazione Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20))
    google_id = db.Column(db.String(100), unique=True)
    profile_picture = db.Column(db.String(200))
    email_verified = db.Column(db.Boolean, default=False)
    reset_token = db.Column(db.String(100))
    reset_expires = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    bookings = db.relationship('Booking', backref='user', lazy=True)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    room_id = db.Column(db.Integer, nullable=False)
    room_name = db.Column(db.String(100), nullable=False)
    checkin_date = db.Column(db.Date, nullable=False)
    checkout_date = db.Column(db.Date, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    nights = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, failed
    payment_method = db.Column(db.String(20))  # card, paypal, transfer
    stripe_payment_intent_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

class SavedPaymentMethod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # card, paypal
    label = db.Column(db.String(50), nullable=False)
    masked_details = db.Column(db.String(100))  # •••• •••• •••• 1234
    stripe_payment_method_id = db.Column(db.String(100))
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

# Utility functions
def generate_token(user_id, expires_delta=None):
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    
    to_encode = {'user_id': user_id, 'exp': expire}
    return jwt.encode(to_encode, app.config['SECRET_KEY'], algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if token and token.startswith('Bearer '):
            token = token[7:]  # Remove 'Bearer ' prefix
            user_id = verify_token(token)
            if user_id:
                g.current_user_id = user_id
                return f(*args, **kwargs)
        return jsonify({'error': 'Authentication required'}), 401
    return decorated_function

# Routes
@app.route('/')
def home():
    return jsonify({
        'status': 'healthy', 
        'message': 'AUROOMS Backend API is running',
        'version': '1.0',
        'endpoints': {
            'health': '/health',
            'auth': '/api/auth/*',
            'user': '/api/user/*',
            'bookings': '/api/bookings',
            'payments': '/api/payments/*'
        }
    })

@app.route('/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'AUROOMS API is running'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validazione
    required_fields = ['email', 'password', 'firstName', 'lastName']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field}'}), 400
    
    # Verifica email esistente
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Validazione password
    if len(data['password']) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # Crea nuovo utente
    user = User(
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        first_name=data['firstName'],
        last_name=data['lastName'],
        phone=data.get('phone', ''),
        email_verified=True  # Per ora auto-verifichiamo
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Genera token
    token = generate_token(user.id)
    
    return jsonify({
        'token': token,
        'user': {
            'id': user.id,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'name': f"{user.first_name} {user.last_name}",
            'phone': user.phone,
            'profilePicture': user.profile_picture
        }
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        token = generate_token(user.id)
        
        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'name': f"{user.first_name} {user.last_name}",
                'phone': user.phone,
                'profilePicture': user.profile_picture
            }
        })
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/google')
def google_login():
    redirect_uri = os.environ.get('GOOGLE_REDIRECT_URI', 'https://your-replit-url.replit.app/api/auth/google/callback')
    return google.authorize_redirect(redirect_uri)

@app.route('/api/auth/google/callback')
def google_callback():
    token = google.authorize_access_token()
    user_info = token['userinfo']
    
    # Cerca utente esistente
    user = User.query.filter_by(email=user_info['email']).first()
    
    if not user:
        # Crea nuovo utente da Google
        user = User(
            email=user_info['email'],
            first_name=user_info.get('given_name', ''),
            last_name=user_info.get('family_name', ''),
            google_id=user_info['sub'],
            profile_picture=user_info.get('picture', ''),
            email_verified=True
        )
        db.session.add(user)
        db.session.commit()
    else:
        # Aggiorna info Google se mancanti
        if not user.google_id:
            user.google_id = user_info['sub']
        if not user.profile_picture:
            user.profile_picture = user_info.get('picture', '')
        db.session.commit()
    
    # Genera token
    token = generate_token(user.id, expires_delta=datetime.timedelta(days=30))
    
    # Redirect al frontend con token
    frontend_url = os.environ.get('FRONTEND_URL', 'https://aurooms.it')
    return redirect(f"{frontend_url}/login.html?token={token}")

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        # Per sicurezza, restituisci sempre successo
        return jsonify({'message': 'If email exists, reset instructions sent'})
    
    # Genera token reset
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    db.session.commit()
    
    # Qui invieresti email con EmailJS o servizio email
    # Per ora restituiamo il token per testing
    
    return jsonify({
        'message': 'Reset instructions sent',
        'reset_token': reset_token  # Rimuovi in produzione
    })

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password required'}), 400
    
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.reset_expires < datetime.datetime.utcnow():
        return jsonify({'error': 'Invalid or expired reset token'}), 400
    
    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    
    # Aggiorna password
    user.password_hash = generate_password_hash(new_password)
    user.reset_token = None
    user.reset_expires = None
    db.session.commit()
    
    return jsonify({'message': 'Password reset successful'})

@app.route('/api/user/profile', methods=['GET'])
@login_required
def get_profile():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'firstName': user.first_name,
        'lastName': user.last_name,
        'name': f"{user.first_name} {user.last_name}",
        'phone': user.phone,
        'profilePicture': user.profile_picture,
        'emailVerified': user.email_verified
    })

@app.route('/api/user/profile', methods=['PUT'])
@login_required
def update_profile():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if 'firstName' in data:
        user.first_name = data['firstName']
    if 'lastName' in data:
        user.last_name = data['lastName']
    if 'phone' in data:
        user.phone = data['phone']
    
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'})

@app.route('/api/user/change-password', methods=['POST'])
@login_required
def change_password():
    user = User.query.get(g.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Current and new password required'}), 400
    
    if not user.password_hash or not check_password_hash(user.password_hash, current_password):
        return jsonify({'error': 'Current password incorrect'}), 400
    
    if len(new_password) < 6:
        return jsonify({'error': 'New password must be at least 6 characters'}), 400
    
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'})

# Bookings API
@app.route('/api/bookings', methods=['POST'])
@login_required
def create_booking():
    data = request.get_json()
    
    required_fields = ['roomId', 'roomName', 'checkinDate', 'checkoutDate', 'guests', 'totalPrice']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing {field}'}), 400
    
    # Calcola notti
    checkin = datetime.datetime.strptime(data['checkinDate'], '%Y-%m-%d').date()
    checkout = datetime.datetime.strptime(data['checkoutDate'], '%Y-%m-%d').date()
    nights = (checkout - checkin).days
    
    if nights <= 0:
        return jsonify({'error': 'Invalid date range'}), 400
    
    booking = Booking(
        user_id=g.current_user_id,
        room_id=data['roomId'],
        room_name=data['roomName'],
        checkin_date=checkin,
        checkout_date=checkout,
        guests=data['guests'],
        nights=nights,
        total_price=data['totalPrice']
    )
    
    db.session.add(booking)
    db.session.commit()
    
    return jsonify({
        'id': booking.id,
        'message': 'Booking created successfully'
    })

@app.route('/api/bookings', methods=['GET'])
@login_required
def get_user_bookings():
    bookings = Booking.query.filter_by(user_id=g.current_user_id).order_by(Booking.created_at.desc()).all()
    
    bookings_data = []
    for booking in bookings:
        bookings_data.append({
            'id': booking.id,
            'roomId': booking.room_id,
            'roomName': booking.room_name,
            'checkinDate': booking.checkin_date.strftime('%Y-%m-%d'),
            'checkoutDate': booking.checkout_date.strftime('%Y-%m-%d'),
            'guests': booking.guests,
            'nights': booking.nights,
            'totalPrice': booking.total_price,
            'status': booking.status,
            'paymentStatus': booking.payment_status,
            'paymentMethod': booking.payment_method,
            'createdAt': booking.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify(bookings_data)

# Stripe Payments
@app.route('/api/payments/create-intent', methods=['POST'])
@login_required
def create_payment_intent():
    data = request.get_json()
    amount = data.get('amount')  # in cents
    currency = data.get('currency', 'eur')
    booking_id = data.get('bookingId')
    
    if not amount:
        return jsonify({'error': 'Amount required'}), 400
    
    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Convert to cents
            currency=currency,
            metadata={'booking_id': booking_id, 'user_id': g.current_user_id}
        )
        
        # Aggiorna booking con payment intent
        if booking_id:
            booking = Booking.query.get(booking_id)
            if booking and booking.user_id == g.current_user_id:
                booking.stripe_payment_intent_id = intent.id
                db.session.commit()
        
        return jsonify({
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/payments/webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return jsonify({'error': 'Invalid payload'}), 400
    except stripe.error.SignatureVerificationError:
        return jsonify({'error': 'Invalid signature'}), 400
    
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Aggiorna booking
        booking = Booking.query.filter_by(stripe_payment_intent_id=payment_intent['id']).first()
        if booking:
            booking.payment_status = 'paid'
            booking.status = 'confirmed'
            booking.payment_method = 'card'
            db.session.commit()
    
    return jsonify({'received': True})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)