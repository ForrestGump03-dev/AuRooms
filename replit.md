# AUROOMS Guest House Website

## Overview

AUROOMS is a guest house booking website for a property in Cinisi, Palermo, Italy. The system provides a modern, bilingual (Italian/English) platform for room reservations with integrated payment processing and admin management capabilities. The project is built as a client-side focused application with Flask backend API support, designed for deployment on static hosting platforms like Netlify with database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Site Generation**: HTML/CSS/JavaScript frontend optimized for Netlify deployment
- **CSS Framework**: PicoCSS for clean, responsive design with custom styling
- **UI Components**: Mobile-responsive design with hamburger menu navigation
- **Multi-language Support**: Dual language system (Italian/English) with flag-based language switching
- **Client-side Routing**: Multiple HTML pages for different user flows (booking, payment, confirmation)

### Backend Architecture
- **Web Framework**: Flask with SQLAlchemy ORM for database operations
- **Authentication**: Multi-provider system supporting Google OAuth and traditional email/password
- **API Design**: RESTful endpoints for booking management, user authentication, and payment processing
- **Security**: JWT token-based authentication with session management
- **Admin System**: Protected admin dashboard with secret URL access pattern for enhanced security

### Data Storage Solutions
- **Primary Database**: PostgreSQL for production (with SQLite fallback for development)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy integration
- **Data Models**: User management, booking records, and admin configurations
- **Local Storage**: Browser localStorage for client-side data persistence and banking information

### Authentication and Authorization
- **OAuth Integration**: Google Sign-In with Authlib for social authentication
- **Traditional Auth**: Email/password system with bcrypt hashing
- **Admin Protection**: Secret URL-based admin access without traditional login system
- **Session Management**: Flask sessions with JWT token support
- **Security Headers**: Anti-indexing and caching protection for admin areas

### Payment Processing
- **Payment Gateway**: Stripe integration for secure payment processing
- **Banking Integration**: Dynamic banking coordinate system with IBAN/BIC management
- **Email Notifications**: EmailJS for booking confirmations and payment notifications
- **Multiple Payment Methods**: Support for various payment options including bank transfers

## External Dependencies

### Core Technologies
- **Flask**: Web framework with CORS support for cross-origin requests
- **SQLAlchemy**: Database ORM with PostgreSQL and SQLite support
- **PicoCSS**: Lightweight CSS framework for responsive design
- **EmailJS**: Client-side email service for notifications

### Authentication Services
- **Google OAuth**: Social login integration via Google Sign-In
- **Authlib**: OAuth client library for Flask integration

### Payment Services
- **Stripe**: Payment processing with secure checkout flows
- **Banking System**: IBAN/BIC based bank transfer support

### Hosting and Deployment
- **Netlify**: Static site hosting with form handling and redirects
- **PostgreSQL**: Production database (likely hosted on platforms like Heroku or Railway)
- **Environment Variables**: Secure configuration management for API keys and secrets

### Development Tools
- **AOS**: Animate On Scroll library for enhanced user experience
- **Swiper**: Touch slider library for image galleries
- **Security Scanning**: Semgrep configuration for code security analysis

### SEO and Analytics
- **Open Graph**: Facebook/Instagram meta tags for social sharing
- **Robots.txt**: Search engine optimization with admin area protection
- **Canonical URLs**: SEO-friendly URL structure