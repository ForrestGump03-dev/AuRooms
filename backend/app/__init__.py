from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    # Config base
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///local.db')
    if app.config['SQLALCHEMY_DATABASE_URI'].startswith('postgres://'):
        # Render/Heroku style fix
        app.config['SQLALCHEMY_DATABASE_URI'] = app.config['SQLALCHEMY_DATABASE_URI'].replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('APP_SECRET', 'dev-secret')

    CORS(app, resources={r"/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)

    # Import models so migrations pick them up
    from . import models  # noqa

    # Register blueprints
    from .blueprints.health import health_bp
    from .blueprints.bookings import bookings_bp
    from .blueprints.payments import payments_bp
    from .blueprints.auth import auth_bp

    app.register_blueprint(health_bp, url_prefix='/api')
    app.register_blueprint(bookings_bp, url_prefix='/api')
    app.register_blueprint(payments_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return {'status': 'ok', 'message': 'AuRooms Backend Flask attivo'}

    return app
