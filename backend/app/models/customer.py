from datetime import datetime
from .. import db

class Customer(db.Model):
    __tablename__ = 'customers'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=True)
    last_name = db.Column(db.String(80), nullable=True)
    name = db.Column(db.String(160), nullable=True)  # Nome completo da Google
    email = db.Column(db.String(120), unique=True, nullable=False)
    google_id = db.Column(db.String(100), unique=True, nullable=True)  # Google user ID
    phone = db.Column(db.String(30), nullable=True)
    country = db.Column(db.String(80), nullable=True)
    document_type = db.Column(db.String(30), nullable=True)  # es: ID, Passport
    document_number = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship('Booking', backref='customer', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'country': self.country,
            'document_type': self.document_type,
            'document_number': self.document_number,
            'created_at': self.created_at.isoformat()
        }
