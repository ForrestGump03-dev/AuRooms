from datetime import datetime
from .. import db

class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    room_name = db.Column(db.String(100), nullable=False)
    check_in = db.Column(db.Date, nullable=False)
    check_out = db.Column(db.Date, nullable=False)
    guests = db.Column(db.Integer, default=1)
    total_amount = db.Column(db.Numeric(10,2), nullable=False)
    currency = db.Column(db.String(10), default='EUR')
    status = db.Column(db.String(30), default='pending')  # pending, confirmed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    payments = db.relationship('Payment', backref='booking', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'room_name': self.room_name,
            'check_in': self.check_in.isoformat(),
            'check_out': self.check_out.isoformat(),
            'guests': self.guests,
            'total_amount': float(self.total_amount),
            'currency': self.currency,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
