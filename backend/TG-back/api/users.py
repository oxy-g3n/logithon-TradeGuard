from flask import Blueprint, current_app, jsonify, request
import jwt
import bcrypt
import datetime
from utils import get_db_connection, token_required

# Define the blueprint for users
user_management = Blueprint('user_management', __name__)


# Authenticate user
@user_management.route('/authenticate', methods=['POST'])
def authenticate():
    email = request.json.get("email")
    password = request.json.get("password")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'SELECT user_id, password, firstName, lastName, email, phoneNumber, companyName, userRole, regNumber, primaryCountry, shippingVolume, created_at FROM users WHERE email = ?',
        (email,))
    result = cursor.fetchone()
    conn.close()

    if result and bcrypt.checkpw(password.encode('utf-8'), result['password'].encode('utf-8')):
        token = jwt.encode({
            'user_id': result['user_id'],
            'email': email,
            'userRole': result['userRole'],
            'regNumber': result['regNumber'],
            'primaryCountry': result['primaryCountry'],
            'created_at': result['created_at'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=90)
        }, current_app.config['SECRET_KEY'])

        return jsonify({
            "success": True,
            "message": "Authentication successful",
            "token": token,
            "user_id": result['user_id'],
            "firstName": result['firstName'],
            "lastName": result['lastName'],
            "email": result['email'],
            "phoneNumber": result['phoneNumber'],
            "companyName": result['companyName'],
            "userRole": result['userRole'],
            "regNumber": result['regNumber'],
            "primaryCountry": result['primaryCountry'],
            "shippingVolume": result['shippingVolume'],
            "created_at": result['created_at'],
        }), 200

    return jsonify({"success": False, "message": "Invalid credentials"}), 401


# Register user
@user_management.route('/register', methods=['POST'])
def register():
    firstName = request.json.get("firstName")
    lastName = request.json.get("lastName")
    email = request.json.get("email")
    phoneNumber = request.json.get("phoneNumber")
    companyName = request.json.get("companyName")
    userRole = request.json.get("userRole")
    companyType = request.json.get("companyType")
    regNumber = request.json.get("regNumber")
    primaryCountry = request.json.get("primaryCountry")
    shippingVolume = request.json.get("shippingVolume")
    password = request.json.get("password")

    # Validate required fields
    if not all([firstName, lastName, email, phoneNumber, companyName, userRole, primaryCountry, password]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # Validate userRole
    if userRole not in ['exporter', 'compliance', 'admin']:
        return jsonify({"success": False, "message": "Invalid user role"}), 400

    # Validate companyType if provided
    if companyType and companyType not in ['sme', 'logistics', 'freight', 'customs']:
        return jsonify({"success": False, "message": "Invalid company type"}), 400

    # Validate shippingVolume if provided
    if shippingVolume and shippingVolume not in ['low', 'medium', 'high']:
        return jsonify({"success": False, "message": "Invalid shipping volume"}), 400

    # Hash the password
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email already exists
    cursor.execute('SELECT COUNT(*) FROM users WHERE email = ?', (email,))
    if cursor.fetchone()[0] > 0:
        conn.close()
        return jsonify({"success": False, "message": "Email already exists"}), 409

    try:
        # Insert new user
        cursor.execute(
            '''INSERT INTO users (firstName, lastName, email, phoneNumber, companyName, userRole, 
            companyType, regNumber, primaryCountry, shippingVolume, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
            (firstName, lastName, email, phoneNumber, companyName, userRole,
             companyType, regNumber, primaryCountry, shippingVolume, password_hash)
        )
        conn.commit()

        # Get the user_id of the newly created user
        user_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user_id": user_id
        }), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Registration failed: {str(e)}"}), 500
    finally:
        conn.close()


# Edit user profile
@user_management.route('/edit-profile', methods=['PUT'])
@token_required
def edit_profile():
    # Get data from the token
    token_data = request.token_data
    token_user_id = token_data['user_id']

    # Get user_id from request
    target_user_id = request.json.get("user_id")

    # Check if user is trying to edit their own profile
    if int(token_user_id) != int(target_user_id):
        return jsonify({"success": False, "message": "You can only edit your own profile"}), 403

    # Get profile data to update
    firstName = request.json.get("firstName")
    lastName = request.json.get("lastName")
    phoneNumber = request.json.get("phoneNumber")
    companyName = request.json.get("companyName")
    companyType = request.json.get("companyType")
    regNumber = request.json.get("regNumber")
    primaryCountry = request.json.get("primaryCountry")
    shippingVolume = request.json.get("shippingVolume")
    twoFA = request.json.get("twoFA")
    notifs = request.json.get("notifs")
    alerts = request.json.get("alerts")

    # Optional password update
    new_password = request.json.get("new_password")
    current_password = request.json.get("current_password")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # If password change is requested, verify current password first
        if new_password and current_password:
            cursor.execute('SELECT password FROM users WHERE user_id = ?', (token_user_id,))
            stored_password = cursor.fetchone()['password']

            if not bcrypt.checkpw(current_password.encode('utf-8'), stored_password.encode('utf-8')):
                return jsonify({"success": False, "message": "Current password is incorrect"}), 401

            # Hash the new password
            password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Update with new password
            cursor.execute(
                '''UPDATE users SET 
                firstName = COALESCE(?, firstName),
                lastName = COALESCE(?, lastName),
                phoneNumber = COALESCE(?, phoneNumber),
                companyName = COALESCE(?, companyName),
                companyType = COALESCE(?, companyType),
                regNumber = COALESCE(?, regNumber),
                primaryCountry = COALESCE(?, primaryCountry),
                shippingVolume = COALESCE(?, shippingVolume),
                twoFA = COALESCE(?, twoFA),
                notifs = COALESCE(?, notifs),
                alerts = COALESCE(?, alerts),
                password = ?
                WHERE user_id = ?''',
                (firstName, lastName, phoneNumber, companyName, companyType, regNumber,
                 primaryCountry, shippingVolume, twoFA, notifs, alerts, password_hash, token_user_id)
            )
        else:
            # Update user without changing password
            cursor.execute(
                '''UPDATE users SET 
                firstName = COALESCE(?, firstName),
                lastName = COALESCE(?, lastName),
                phoneNumber = COALESCE(?, phoneNumber),
                companyName = COALESCE(?, companyName),
                companyType = COALESCE(?, companyType),
                regNumber = COALESCE(?, regNumber),
                primaryCountry = COALESCE(?, primaryCountry),
                shippingVolume = COALESCE(?, shippingVolume),
                twoFA = COALESCE(?, twoFA),
                notifs = COALESCE(?, notifs),
                alerts = COALESCE(?, alerts)
                WHERE user_id = ?''',
                (firstName, lastName, phoneNumber, companyName, companyType, regNumber,
                 primaryCountry, shippingVolume, twoFA, notifs, alerts, token_user_id)
            )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "Profile updated successfully"
        }), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Update failed: {str(e)}"}), 500
    finally:
        conn.close()