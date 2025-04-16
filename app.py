from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import requests
import json
from bson import ObjectId
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
jwt = JWTManager(app)

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI", "mongodb+srv://aryanpatankar27:5snbBYIPAeztZuNZ@cluster0.emje1ty.mongodb.net/")
client = MongoClient(mongo_uri)
db = client["prepwise"]
users_collection = db["users"]
mcq_collection = db["mcq_results"]

# Google Gemini API setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super(JSONEncoder, self).default(obj)

app.json_encoder = JSONEncoder

# Routes
@app.route('/')
def home():
    return jsonify({"status": "success", "message": "PrepWise Flask API is running"})

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    # Check if user already exists
    if users_collection.find_one({"email": data['email']}):
        return jsonify({"status": "error", "message": "User already exists"}), 400
    
    # Create new user
    user = {
        "name": data['name'],
        "email": data['email'],
        "password": generate_password_hash(data['password']),
        "createdAt": ObjectId().generation_time
    }
    
    result = users_collection.insert_one(user)
    
    # Generate token
    access_token = create_access_token(identity=str(result.inserted_id))
    
    return jsonify({
        "status": "success",
        "message": "User registered successfully",
        "token": access_token,
        "user": {
            "id": str(result.inserted_id),
            "name": user['name'],
            "email": user['email']
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"status": "error", "message": "Missing email or password"}), 400
    
    # Find user
    user = users_collection.find_one({"email": data['email']})
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401
    
    # Generate token
    access_token = create_access_token(identity=str(user['_id']))
    
    return jsonify({
        "status": "success",
        "message": "Login successful",
        "token": access_token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200

@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    user = users_collection.find_one({"_id": ObjectId(current_user_id)})
    
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404
    
    return jsonify({
        "status": "success",
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200

# Gemini API routes
@app.route('/api/gemini/text', methods=['POST'])
def gemini_text():
    data = request.json
    
    if not data or not data.get('prompt'):
        return jsonify({"status": "error", "message": "Missing prompt"}), 400
    
    max_tokens = data.get('max_tokens', 8096)
    temperature = data.get('temperature', 0.7)
    
    # Prepare payload for Gemini API
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": data['prompt']
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }
    
    # Make request to Gemini API
    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json=payload
        )
        
        if not response.ok:
            return jsonify({
                "status": "error", 
                "message": f"Gemini API error: {response.status_code} - {response.text}"
            }), 500
        
        data = response.json()
        
        if not data.get('candidates') or not data['candidates'][0].get('content') or not data['candidates'][0]['content'].get('parts'):
            return jsonify({"status": "error", "message": "Invalid response structure from Gemini API"}), 500
        
        text = data['candidates'][0]['content']['parts'][0]['text']
        
        return jsonify({
            "status": "success",
            "text": text
        }), 200
        
    except Exception as e:
        print(f"Error in Gemini API request: {str(e)}")
        return jsonify({"status": "error", "message": f"Error: {str(e)}"}), 500

# MCQ Results routes
@app.route('/api/mcq/save', methods=['POST'])
@jwt_required()
def save_mcq_result():
    user_id = get_jwt_identity()
    data = request.json
    
    if not data:
        return jsonify({"status": "error", "message": "No data provided"}), 400
    
    if not data.get('question') or not data.get('selectedOption') or not data.get('correctOption') or not data.get('isCorrect'):
        return jsonify({"status": "error", "message": "Missing required fields"}), 400
    
    # Create result object
    result = {
        "userId": ObjectId(user_id),
        "question": data['question'],
        "selectedOption": data['selectedOption'],
        "correctOption": data['correctOption'],
        "isCorrect": data['isCorrect'],
        "questionType": data.get('questionType', 'topic'),  # 'topic' or 'pdf'
        "topic": data.get('topic', ''),
        "timestamp": ObjectId().generation_time
    }
    
    # Insert into collection
    mcq_collection.insert_one(result)
    
    return jsonify({
        "status": "success",
        "message": "MCQ result saved successfully"
    }), 201

@app.route('/api/mcq/history', methods=['GET'])
@jwt_required()
def get_mcq_history():
    user_id = get_jwt_identity()
    
    # Get results for the current user
    results = list(mcq_collection.find({"userId": ObjectId(user_id)}).sort("timestamp", -1))
    
    return jsonify({
        "status": "success",
        "results": results
    }), 200

@app.route('/api/mcq/stats', methods=['GET'])
@jwt_required()
def get_mcq_stats():
    user_id = get_jwt_identity()
    
    # Get all results for the current user
    results = list(mcq_collection.find({"userId": ObjectId(user_id)}))
    
    # Calculate stats
    total = len(results)
    correct = sum(1 for result in results if result['isCorrect'])
    accuracy = (correct / total) * 100 if total > 0 else 0
    
    # Get stats by topic
    topic_stats = {}
    for result in results:
        topic = result.get('topic', 'Unknown')
        if topic not in topic_stats:
            topic_stats[topic] = {"total": 0, "correct": 0}
        
        topic_stats[topic]["total"] += 1
        if result['isCorrect']:
            topic_stats[topic]["correct"] += 1
    
    # Calculate accuracy for each topic
    for topic in topic_stats:
        topic_stats[topic]["accuracy"] = (topic_stats[topic]["correct"] / topic_stats[topic]["total"]) * 100
    
    return jsonify({
        "status": "success",
        "stats": {
            "total": total,
            "correct": correct,
            "accuracy": accuracy,
            "byTopic": topic_stats
        }
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000))) 