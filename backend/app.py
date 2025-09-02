from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ajo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# MODELS
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    contributions = db.relationship('Contribution', backref='user', lazy=True)

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    users = db.relationship('User', backref='group', lazy=True)  # Add this
    contributions = db.relationship('Contribution', backref='group', lazy=True)

class Contribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)  # Add this line

# ROUTES
@app.route('/')
def home():
    return jsonify({"message": "Ajo API is running 🚀"})

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    if not data or 'name' not in data or 'group_id' not in data:
        return jsonify({"error": "Name and group_id are required"}), 400
    group = Group.query.get(data['group_id'])
    if not group:
        return jsonify({"error": "Group not found"}), 404
    new_user = User(name=data['name'], group_id=data['group_id'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"id": new_user.id, "name": new_user.name, "group_id": new_user.group_id})

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "id": u.id,
            "name": u.name,
            "group_id": u.group_id,
            "group_name": u.group.name if u.group else None
        }
        for u in users
    ])

@app.route('/groups', methods=['POST'])
def add_group():
    data = request.get_json()
    if not data or 'name' not in data:
        return jsonify({"error": "Name is required"}), 400
    new_group = Group(name=data['name'])
    db.session.add(new_group)
    db.session.commit()
    return jsonify({"id": new_group.id, "name": new_group.name})

@app.route('/groups', methods=['GET'])
def get_groups():
    groups = Group.query.all()
    return jsonify([{"id": g.id, "name": g.name} for g in groups])

@app.route('/contributions', methods=['POST'])
def add_contribution():
    data = request.get_json()
    required_fields = ['amount', 'user_id', 'group_id']
    if not data or not all(field in data for field in required_fields):
        return jsonify({"error": "amount, user_id, and group_id are required"}), 400
    # Optionally, check if user and group exist
    user = User.query.get(data['user_id'])
    group = Group.query.get(data['group_id'])
    if not user or not group:
        return jsonify({"error": "User or Group not found"}), 404
    new_contribution = Contribution(
        amount=data['amount'],
        user_id=data['user_id'],
        group_id=data['group_id']
    )
    db.session.add(new_contribution)
    db.session.commit()
    return jsonify({
        "id": new_contribution.id,
        "amount": new_contribution.amount,
        "user_id": new_contribution.user_id,
        "group_id": new_contribution.group_id
    })

@app.route('/contributions', methods=['GET'])
def get_contributions():
    contributions = Contribution.query.all()
    results = []
    for c in contributions:
        results.append({
            "id": c.id,
            "amount": c.amount,
            "user_id": c.user_id,
            "user_name": c.user.name if c.user else None,
            "group_id": c.group_id,
            "group_name": c.group.name if c.group else None
        })
    return jsonify(results)

@app.route('/dashboard', methods=['GET'])
def dashboard():
    groups = Group.query.all()
    results = []
    for g in groups:
        total = db.session.query(db.func.sum(Contribution.amount)).filter_by(group_id=g.id).scalar() or 0
        results.append({
            "group_id": g.id,
            "group_name": g.name,
            "total_contributions": total
        })
    return jsonify(results)

@app.route('/groups/<int:group_id>/users', methods=['GET'])
def get_users_in_group(group_id):
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    users = [{"id": u.id, "name": u.name} for u in group.users]
    return jsonify({"group_id": group.id, "group_name": group.name, "users": users})

@app.route('/groups/<int:group_id>/users/<int:user_id>/contribute', methods=['POST'])
def add_user_contribution(group_id, user_id):
    data = request.get_json()
    amount = data.get('amount')
    if amount is None or not isinstance(amount, (int, float)) or float(amount) <= 0:
        return jsonify({"error": "Amount must be a positive number"}), 400
    user = User.query.get(user_id)
    group = Group.query.get(group_id)
    if not user or not group or user.group_id != group_id:
        return jsonify({"error": "User or Group not found, or user not in group"}), 404
    contribution = Contribution(amount=float(amount), user_id=user_id, group_id=group_id)
    db.session.add(contribution)
    db.session.commit()
    return jsonify({
        "id": contribution.id,
        "amount": contribution.amount,
        "user_id": contribution.user_id,
        "group_id": contribution.group_id
    })

@app.route('/users/<int:user_id>/contributions', methods=['GET'])
def get_user_contributions(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    contributions = Contribution.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": c.id,
            "amount": c.amount,
            "group_id": c.group_id,
            "group_name": c.group.name if c.group else None,
            "timestamp": c.timestamp.strftime("%Y-%m-%d %H:%M:%S") if c.timestamp else None
        }
        for c in contributions
    ])


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
