from datetime import datetime
import random
import pymongo.errors
import string
from pymongo import MongoClient
from bson import ObjectId
from functools import wraps
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
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

'''@login_required
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
'''

@login_required
@app.route('/myevents', methods=['GET'])
def get_my_events():
    userid = session.get("userID")
    if not userid:
        return jsonify({"error": "User not logged in"}), 401  # Unauthorized

    user_object_id = ObjectId(userid)
    
    # Get events created by the current user
    created_events = list(records.find({'user_id': user_object_id}))
    # Get events where the current user has joined
    user_profile = records.find_one({'_id': user_object_id})
    if not user_profile:
        return jsonify({"error": "User profile not found"}), 404 
    

    joined_event_codes = user_profile.get("joined_events", [])

    joined_events = list(records.find({'unique_code': {'$in': joined_event_codes}}))

    print("created  events: ", created_events)
    print("joined  events: ", joined_events)
    print('works!')
    # Clean the data and exclude fields like '_id' and 'user_id' if needed
    def determine_status(event):
        # If the user created the event, they're the owner
        if event.get('user_id') == user_object_id:
            return 'owner'

        # Check if the user has joined the event and get their status
        joined_users = event.get('joined_users', [])
        if isinstance(joined_users, list):
            for ju in joined_users:
                if isinstance(ju, dict) and ju.get('user_id') == user_object_id:
                    return ju.get('status', 'unknown')  # Default status if not specified
        
        return 'unknown'
        
        
        
    def clean_event(event):
        # Remove unnecessary keys
        keys_to_exclude = ['_id', 'user_id', 'joined_users']
        cleaned_event = {k: v for k, v in event.items() if k not in keys_to_exclude}
        # Set the status
        cleaned_event['status'] = determine_status(event)
        return cleaned_event
    # Apply cleaning function to both created and joined events

    all_events = [clean_event(event) for event in created_events + joined_events]
    print(all_events)
    # Optional: Remove duplicates if any event appears in both lists
    seen = set()
    unique_events = []
    for event in all_events:
        event_repr = tuple(sorted(event.items()))  # Create a hashable representation of the event
        if event_repr not in seen:
            unique_events.append(event)
            seen.add(event_repr)

    return jsonify(all_events)




def generate_unique_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


UPLOAD_FOLDER = 'static/images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/submit-event', methods=['POST'])
def submit_event():
    # Retrieve user ID from session
    user_id = ObjectId(session.get("userID"))

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401  # Unauthorized
    unique_code = generate_unique_code()
    # Initialize event record for MongoDB
    event_record = {
        "user_id": user_id,
        
        "created_at": datetime.now().strftime("%d-%m-%Y"),
        "unique_code": unique_code,
        "status" : '',
        "joined_users" : [],
    }

    # Handle file upload (if there's an image field in the form)
    if 'image' in request.files:
        image = request.files['image']
        filename = secure_filename(image.filename)  # Secure the filename
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_path.replace("\\", "/")
        image.save(image_path)  # Save the image in the static folder
        event_record["image_path"] = image_path

    # Loop through the form fields to collect key-value pairs
    print(request.form)
    for key, value in request.form.items():
        event_record[key] = value  # Store field in event_record

    try:
        # Insert event data into MongoDB
        # print(event_record)
        records.insert_one(event_record)

        return jsonify({"message": "Event created successfully", "unique_code": unique_code}), 200  # Success
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error


@app.route('/join-event', methods=['POST'])
@login_required
def join_event():
    # Retrieve user ID from session
    user_id = ObjectId(session.get("userID"))

    if not user_id:
        return jsonify({"error": "User not logged in"}), 401  # Unauthorized
    
    # Get the unique code from the JSON request body
    unique_code = request.json.get("unique_code")

    if not unique_code:
        return jsonify({"error": "Unique code is required"}), 400  # Bad Request
    
    try:
        # Find the event with the given unique code
        event = records.find_one({"unique_code": unique_code})

        if not event:
            return jsonify({"error": "Event with this code does not exist"}), 404  # Not Found
        
        

        # Check if the user is already in the joined_users list
        if user_id in event.get("joined_users", []):
            return jsonify({"error": "User has already joined this event"}), 400  # Bad Request
        
        # Add the user ID to the joined_users list
        records.update_one(
            {"unique_code": unique_code},
            {"$push": {"joined_users": {"user_id": user_id, "status": "pending"}}}  # Append the user to joined_users
        )

        user = records.find_one({"_id": user_id})
        if user:
            records.update_one(
                {"_id": user_id},
                {"$push": {"joined_events": unique_code}}
            )

        return jsonify({"message": "Successfully joined the event"}), 200  # Success
    
    except pymongo.errors.PyMongoError as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error


@app.route('/participants', methods=['GET'])
@login_required
def get_participants():
    event_code = request.args.get("event_code")
    if not event_code:
        return jsonify({"error": "Event code is required"}), 400  # Bad Request
    
    event = records.find_one({"unique_code": event_code})
    if not event:
        return jsonify({"error": "Event not found"}), 404  # Not Found
    
    participants = []
    seen_users = set()  # To track unique users

    # Retrieve the joined users list from the event
    joined_users = event.get('joined_users', [])
    
    # Ensure joined_users is a list and remove duplicates
    if isinstance(joined_users, list):
        for ju in joined_users:
            # Ensure it's a dictionary and contains 'user_id'
            if isinstance(ju, dict) and 'user_id' in ju:
                user_id = ju['user_id']
                if user_id not in seen_users:
                    # Add to the set to avoid duplicates
                    seen_users.add(user_id)
                    # Fetch user details from the database
                    user = records.find_one({"_id": ObjectId(user_id)})
                    if user:
                        # Add participant details to the list
                        participants.append({
                            "username": user.get("username", "Unknown"),
                            "email": user.get("email", "Unknown"),
                            "status": ju.get("status", "unknown"),
                        })

    return jsonify(participants), 200  # Success


if(__name__ == "__main__"):
    app.run(debug=True)

