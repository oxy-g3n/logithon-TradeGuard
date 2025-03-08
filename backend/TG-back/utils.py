from functools import wraps
from flask import request, jsonify, current_app
import jwt
import sqlite3


def get_db_connection():
    conn = sqlite3.connect('./database/database.db')
    conn.row_factory = sqlite3.Row
    return conn


def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 403
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""SELECT user_id, firstName, lastName, email, phoneNumber, companyName, 
                           userRole, regNumber, primaryCountry, shippingVolume, created_at 
                           FROM users WHERE user_id = ?""", (data['user_id'],))
            user_info = cursor.fetchone()
            if not user_info:
                return jsonify({'message': 'User not found'}), 404

            # Update token data with latest user info
            data['user_id'] = user_info['user_id']
            data['userRole'] = user_info['userRole']
            data['regNumber'] = user_info['regNumber']
            data['primaryCountry'] = user_info['primaryCountry']

            # Add the decoded token data to the request context
            request.token_data = data
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 403
        finally:
            if 'conn' in locals():
                conn.close()
        return f(*args, **kwargs)

    return decorated_function