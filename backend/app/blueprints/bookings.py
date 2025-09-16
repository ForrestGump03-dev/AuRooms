from flask import Blueprint, request
from datetime import datetime
from .. import db
from ..models import Booking, Customer

bookings_bp = Blueprint('bookings', __name__)

@bookings_bp.get('/bookings')
def list_bookings():
    items = Booking.query.order_by(Booking.created_at.desc()).limit(100).all()
    return {'bookings': [b.to_dict() for b in items]}

@bookings_bp.post('/bookings')
def create_booking():
    data = request.get_json(force=True)
    required = ['first_name', 'last_name', 'email', 'room_name', 'check_in', 'check_out', 'total_amount']
    missing = [r for r in required if r not in data]
    if missing:
        return {'error': 'missing_fields', 'fields': missing}, 400

    # Trova o crea il cliente
    customer = Customer.query.filter_by(email=data['email']).first()
    if not customer:
        customer = Customer(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone=data.get('phone'),
            country=data.get('country'),
            document_type=data.get('document_type'),
            document_number=data.get('document_number')
        )
        db.session.add(customer)
        db.session.flush()  # ottiene id

    booking = Booking(
        customer_id=customer.id,
        room_name=data['room_name'],
        check_in=datetime.fromisoformat(data['check_in']).date(),
        check_out=datetime.fromisoformat(data['check_out']).date(),
        guests=data.get('guests', 1),
        total_amount=data['total_amount'],
        currency=data.get('currency', 'EUR'),
        status='pending'
    )
    db.session.add(booking)
    db.session.commit()

    return {'booking': booking.to_dict(), 'customer': customer.to_dict()}, 201
