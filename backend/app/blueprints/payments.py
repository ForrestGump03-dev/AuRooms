from flask import Blueprint, request
from .. import db
from ..models import Payment, Booking

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
def create_payment_intent_stub():
    data = request.get_json(force=True)
    amount = data.get('amount')
    if not amount:
        return {'error': 'amount_required'}, 400
    # Placeholder: qui integreremo Stripe
    return {
        'stub': True,
        'message': 'Stripe integration non ancora attiva',
        'amount': amount,
        'currency': data.get('currency', 'EUR')
    }, 200
