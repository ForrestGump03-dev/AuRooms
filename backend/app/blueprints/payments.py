from flask import Blueprint, request
from .. import db
from ..models import Payment, Booking
import os

try:
    import stripe
except ImportError:
    stripe = None

payments_bp = Blueprint('payments', __name__)

@payments_bp.post('/payments/record')
def record_payment():
    data = request.get_json(force=True)
    required = ['booking_id', 'provider', 'amount']
    missing = [r for r in required if r not in data]
    if missing:
        return {'error': 'missing_fields', 'fields': missing}, 400

    booking = Booking.query.get(data['booking_id'])
    if not booking:
        return {'error': 'booking_not_found'}, 404

    payment = Payment(
        booking_id=booking.id,
        provider=data['provider'],
        amount=data['amount'],
        currency=data.get('currency', 'EUR'),
        status=data.get('status', 'pending'),
        external_id=data.get('external_id')
    )
    db.session.add(payment)
    db.session.commit()
    return {'payment': payment.to_dict()}, 201

@payments_bp.post('/payments/intent')
def create_payment_intent():
    data = request.get_json(force=True)
    amount = data.get('amount')
    currency = data.get('currency', 'EUR').lower()
    booking_id = data.get('booking_id')

    if not amount:
        return {'error': 'amount_required'}, 400

    if not stripe:
        return {'error': 'stripe_not_installed'}, 500

    secret_key = os.getenv('STRIPE_SECRET_KEY')
    if not secret_key:
        return {'error': 'stripe_not_configured'}, 500

    stripe.api_key = secret_key

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(round(float(amount) * 100)),
            currency=currency,
            metadata={
                'integration': 'aurooms_flask',
                'booking_id': str(booking_id) if booking_id else 'none'
            },
            automatic_payment_methods={'enabled': True}
        )
        return {
            'client_secret': intent.client_secret,
            'payment_intent_id': intent.id,
            'amount': amount,
            'currency': currency
        }, 200
    except Exception as e:
        return {'error': 'stripe_error', 'message': str(e)}, 500
