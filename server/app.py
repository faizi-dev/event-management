from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/eventdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Authentication routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.password == data['password']:  # In production, use proper password hashing
        login_user(user)
        return jsonify({'message': 'Login successful'})
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/protected')
@login_required
def protected():
    return jsonify({'message': 'Authenticated'})

# Event routes
@app.route('/api/events', methods=['GET'])
@login_required
def get_events():
    events = Event.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': event.id,
        'title': event.title,
        'date': event.date.isoformat(),
        'location': event.location,
        'description': event.description,
        'category': event.category
    } for event in events])

@app.route('/api/events', methods=['POST'])
@login_required
def create_event():
    data = request.get_json()
    new_event = Event(
        title=data['title'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
        location=data['location'],
        description=data['description'],
        category=data['category'],
        user_id=current_user.id
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'id': new_event.id}), 201

@app.route('/api/events/<int:id>', methods=['PUT'])
@login_required
def update_event(id):
    event = Event.query.get_or_404(id)
    if event.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    event.title = data['title']
    event.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
    event.location = data['location']
    event.description = data['description']
    event.category = data['category']
    
    db.session.commit()
    return jsonify({'message': 'Event updated successfully'})

@app.route('/api/events/<int:id>', methods=['DELETE'])
@login_required
def delete_event(id):
    event = Event.query.get_or_404(id)
    if event.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Event deleted successfully'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)