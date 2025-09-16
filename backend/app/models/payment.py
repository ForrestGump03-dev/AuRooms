from datetime import datetime
from .. import db

class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    provider = db.Column(db.String(30), nullable=False)  # stripe, bank_transfer
    amount = db.Column(db.Numeric(10,2), nullable=False)
    currency = db.Column(db.String(10), default='EUR')
    status = db.Column(db.String(30), default='pending')  # pending, succeeded, failed, refunded
    external_id = db.Column(db.String(120), nullable=True)  # Stripe payment_intent id etc
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'booking_id': self.booking_id,
            'provider': self.provider,
            'amount': float(self.amount),
            'currency': self.currency,
            'status': self.status,
            'external_id': self.external_id,
            'created_at': self.created_at.isoformat()
        }
