from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime
import jwt
from functools import wraps

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# MongoDB connection
MONGO_URI = os.environ.get('MONGODB_URI', 'mongodb+srv://aryanpatankar27:5snbBYIPAeztZuNZ@cluster0.emje1ty.mongodb.net/')
JWT_SECRET = os.environ.get('JWT_SECRET', 'your_jwt_secret_key')
client = MongoClient(MONGO_URI)
db = client['prepwise_db']

# Collections
mcq_results = db['mcq_results']
users = db.users

# Authentication middleware
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            # Decode the token
            data = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            current_user = users.find_one({'_id': ObjectId(data['id'])})
            
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Invalid token!', 'error': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes
@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({
        'success': True,
        'message': 'API is working'
    }), 200

@app.route('/api/mcq-results', methods=['POST'])
def save_mcq_result():
    try:
        data = request.json
        
        # Create the MCQ result document
        mcq_result = {
            'guestId': data.get('guestId', f'guest_{datetime.now().timestamp()}'),
            'type': data.get('type'),
            'topic': data.get('topic'),
            'pdfName': data.get('pdfName'),
            'questions': data.get('questions', []),
            'score': data.get('score', 0),
            'totalQuestions': data.get('totalQuestions', 0),
            'createdAt': datetime.now()
        }
        
        # Insert into MongoDB
        result = mcq_results.insert_one(mcq_result)
        
        # Update the inserted document with its ID
        mcq_result['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'MCQ result saved successfully',
            'result': mcq_result
        }), 201
        
    except Exception as e:
        print(f"Error saving MCQ result: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to save MCQ result',
            'error': str(e)
        }), 500

@app.route('/api/mcq-results', methods=['GET'])
def get_mcq_results():
    try:
        # Get recent results (limit to 50)
        results = list(mcq_results.find().sort('createdAt', -1).limit(50))
        
        # Convert ObjectId to string
        for result in results:
            result['_id'] = str(result['_id'])
            
        return jsonify(results), 200
        
    except Exception as e:
        print(f"Error fetching MCQ results: {e}")
        return jsonify({
            'success': False, 
            'message': 'Failed to fetch MCQ results',
            'error': str(e)
        }), 500

@app.route('/api/mcq-results/<result_id>', methods=['GET'])
def get_mcq_result(result_id):
    try:
        # Find the specific result
        result = mcq_results.find_one({
            '_id': ObjectId(result_id)
        })
        
        if not result:
            return jsonify({
                'success': False,
                'message': 'MCQ result not found'
            }), 404
            
        # Convert ObjectId to string
        result['_id'] = str(result['_id'])
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error fetching MCQ result: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to fetch MCQ result',
            'error': str(e)
        }), 500

@app.route('/api/mcq-stats', methods=['GET'])
def get_mcq_stats():
    try:
        # Get overall statistics
        pipeline = [
            {'$group': {
                '_id': '$type',
                'totalAttempts': {'$sum': 1},
                'avgScore': {'$avg': {'$divide': ['$score', '$totalQuestions']}},
                'bestScore': {'$max': {'$divide': ['$score', '$totalQuestions']}}
            }}
        ]
        
        stats = list(mcq_results.aggregate(pipeline))
        
        # Format percentages
        for stat in stats:
            stat['avgScore'] = round(stat['avgScore'] * 100, 2)
            stat['bestScore'] = round(stat['bestScore'] * 100, 2)
            
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"Error fetching MCQ stats: {e}")
        return jsonify({
            'success': False,
            'message': 'Failed to fetch MCQ statistics',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Use 127.0.0.1 instead of 0.0.0.0 to avoid permission errors on Windows
    app.run(host='127.0.0.1', port=port, debug=True) 