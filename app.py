from pymongo import MongoClient
from bson import ObjectId
from functools import wraps
from dotenv import load_dotenv
import os
from flask import Flask, render_template, request, jsonify, session,  url_for, redirect
app = Flask(__name__)

load_dotenv()
secretKey  = os.getenv('secretKey')
mongoKey = os.getenv('mongoClient')

app.secret_key = secretKey 
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'userID' not in session:
            return redirect(url_for('index'))
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")

def index():
    return render_template("index.html")

client = MongoClient(mongoKey)
db = client.get_database("EventPlanner")
records = db.keys

'''
db name = EventPlanner
cluster name = keys
'''
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing fields'}), 400
    
    # Check if user already exists
    if records.find_one({'email': data['email']}):
        return jsonify({'error': 'User already exists. Try logging in'}), 409

    # Insert user into MongoDB
    user_id = records.insert_one(data).inserted_id
    
    return jsonify({'success': 'User created successfully', 'user_id': str(user_id)}), 201



@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Missing fields'}), 400

    # Retrieve user from database
    user = records.find_one({'email': data['email']})

    if user:
        # Check if the password matches
        # hashed_password = hashlib.sha256(data['password'].encode()).hexdigest()
        if user['password'] == data['password']:
            # Password matches, login successful
            session['userID'] = str(user['_id'])
            print(session['userID'])
            return jsonify({'success': 'Login successful', 'user_id': str(user['_id'])}), 200
        else:
            # Password doesn't match
            return jsonify({'error': 'Invalid password'}), 401
    else:
        # User not found
        return jsonify({'error': 'User not found'}), 404


@login_required
@app.route("/main/<id>", methods = ['GET'])
def mainpage(id):
    #   return "login required first"     
    if session['userID'] != id:
        return "credentials do not match"
    
    object_id_to_search = ObjectId(id)
    user_details = records.find_one({'_id': object_id_to_search})
    print(user_details)
    return render_template("mainpage.html", user = user_details)

@login_required
@app.route('/myevents' , methods = ['GET'])
def get_my_events():
    userid = session.get("userID")
    # Retrieve data from database or other source
    cursor = records.find({'user_id': ObjectId(userid)})

    # Initialize a list to store event details
    event_details = []

    # Iterate over the cursor to access individual documents
    
    for event in cursor:
        # Exclude the '_id' field from the event details
        del event['_id']
        del event['user_id']
        event_details.append(event)

    print(event_details)
    return jsonify(event_details)



if(__name__ == "__main__"):
    app.run(debug=True)

