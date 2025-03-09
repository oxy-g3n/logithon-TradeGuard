from flask import Blueprint, current_app, make_response, abort, send_file, request, jsonify, Response
import datetime
import uuid
from utils import get_db_connection, token_required
from io import BytesIO
import re

# Define the blueprint for consignments
consignment_management = Blueprint('consignment_management', __name__)

def validate_field_type(value, field_name, expected_type, required=True):
    """Validate field type and return tuple of (is_valid, error_message)"""
    if value is None or value == "":
        if required:
            return False, f"Field '{field_name}' is required"
        return True, None
    
    try:
        if expected_type == int:
            int(value)
        elif expected_type == float:
            float(value)
        elif expected_type == "date":
            datetime.datetime.strptime(value, "%Y-%m-%d")
        return True, None
    except (ValueError, TypeError):
        return False, f"Invalid data type for field '{field_name}'. Expected {expected_type.__name__}"

# Add new consignment
@consignment_management.route('/add-consignment', methods=['POST'])
def add_consignment():
    try:
        # Extract data from form
        form_data = {
            "sender_name": (request.form.get("sender_name"), str),
            "sender_address": (request.form.get("sender_address"), str),
            "sender_country": (request.form.get("sender_country"), str),
            "sender_mail": (request.form.get("sender_mail"), str),
            "sender_phone": (request.form.get("sender_phone"), str),
            "receiver_name": (request.form.get("receiver_name"), str),
            "receiver_address": (request.form.get("receiver_address"), str),
            "receiver_country": (request.form.get("receiver_country"), str),
            "shipment_id": (request.form.get("shipment_id"), str),
            "shipment_date": (request.form.get("shipment_date", datetime.datetime.utcnow().strftime("%Y-%m-%d")), "date"),
            "PackageQuantity": (request.form.get("PackageQuantity"), int),
            "HS_code": (request.form.get("HS_code"), str),
            "totalWeight": (request.form.get("totalWeight"), float),
            "Item_desc": (request.form.get("Item_desc"), str),
            "handling_inst": (request.form.get("handling_inst", ""), str, False)  # Not required
        }

        # Validate all fields
        validation_errors = []
        validated_data = {}
        
        for field_name, (value, expected_type, *args) in form_data.items():
            required = True if not args else args[0]
            is_valid, error_message = validate_field_type(value, field_name, expected_type, required)
            if not is_valid:
                validation_errors.append(error_message)
            else:
                if value is not None and value != "":
                    if expected_type == int:
                        validated_data[field_name] = int(value)
                    elif expected_type == float:
                        validated_data[field_name] = float(value)
                    else:
                        validated_data[field_name] = value

        if validation_errors:
            return jsonify({
                "success": False,
                "error": "Data type mismatch",
                "details": validation_errors
            }), 400
            
        # Handle PDF upload
        commercial_invoice_file = request.files.get('commercial_invoice')
        commercial_invoice = commercial_invoice_file.read() if commercial_invoice_file else None
        
        # Default compliance status is pending
        compliant = "pending"
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if shipment_id already exists
        cursor.execute('SELECT COUNT(*) FROM Consignments WHERE shipment_id = ?', (validated_data['shipment_id'],))
        if cursor.fetchone()[0] > 0:
            conn.close()
            return jsonify({"success": False, "message": "Shipment ID already exists"}), 409
        
        # Insert new consignment - removed uuid from INSERT as it's AUTOINCREMENT
        cursor.execute('''
            INSERT INTO Consignments (
                sender_name, sender_address, sender_country, sender_mail, sender_phone,
                receiver_name, receiver_address, receiver_country, shipment_id, shipment_date,
                PackageQuantity, HS_code, totalWeight, Item_desc, handling_inst,
                commercial_invoice, compliant
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            validated_data['sender_name'],
            validated_data['sender_address'],
            validated_data['sender_country'],
            validated_data['sender_mail'],
            validated_data['sender_phone'],
            validated_data['receiver_name'],
            validated_data['receiver_address'],
            validated_data['receiver_country'],
            validated_data['shipment_id'],
            validated_data['shipment_date'],
            validated_data['PackageQuantity'],
            validated_data['HS_code'],
            validated_data['totalWeight'],
            validated_data['Item_desc'],
            validated_data.get('handling_inst', ''),
            commercial_invoice,
            compliant
        ))
        
        # Get the last inserted id
        cursor.execute('SELECT last_insert_rowid()')
        consignment_id = cursor.fetchone()[0]
        
        conn.commit()
        conn.close()
        
        return jsonify({
            "success": True, 
            "message": "Consignment added successfully",
            "uuid": consignment_id
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False, 
            "error": str(e),
            "error_type": type(e).__name__
        }), 500

# Fetch all consignments
@consignment_management.route('/fetch-consignments', methods=['GET'])
@token_required
def fetch_consignments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                uuid, sender_name, sender_address, sender_country, sender_mail, sender_phone,
                receiver_name, receiver_address, receiver_country, shipment_id, shipment_date,
                PackageQuantity, HS_code, totalWeight, Item_desc, handling_inst,
                compliant, created_at
            FROM Consignments
            ORDER BY created_at DESC
        ''')
        
        consignments = cursor.fetchall()
        conn.close()
        
        if not consignments:
            return jsonify({"success": False, "message": "No consignments found"}), 404
        
        result = []
        for row in consignments:
            result.append({
                "uuid": row[0],
                "sender_name": row[1],
                "sender_address": row[2],
                "sender_country": row[3],
                "sender_mail": row[4],
                "sender_phone": row[5],
                "receiver_name": row[6],
                "receiver_address": row[7],
                "receiver_country": row[8],
                "shipment_id": row[9],
                "shipment_date": row[10],
                "package_quantity": row[11],
                "hs_code": row[12],
                "total_weight": row[13],
                "item_desc": row[14],
                "handling_inst": row[15],
                "compliant": row[16],
                "created_at": row[17]
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Fetch single consignment by UUID
@consignment_management.route('/fetch-consignment/<string:consignment_uuid>', methods=['GET'])
@token_required
def fetch_consignment(consignment_uuid):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                uuid, sender_name, sender_address, sender_country, sender_mail, sender_phone,
                receiver_name, receiver_address, receiver_country, shipment_id, shipment_date,
                PackageQuantity, HS_code, totalWeight, Item_desc, handling_inst,
                compliant, created_at
            FROM Consignments
            WHERE uuid = ?
        ''', (consignment_uuid,))
        
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return jsonify({"success": False, "message": "Consignment not found"}), 404
        
        consignment = {
            "uuid": row[0],
            "sender_name": row[1],
            "sender_address": row[2],
            "sender_country": row[3],
            "sender_mail": row[4],
            "sender_phone": row[5],
            "receiver_name": row[6],
            "receiver_address": row[7],
            "receiver_country": row[8],
            "shipment_id": row[9],
            "shipment_date": row[10],
            "package_quantity": row[11],
            "hs_code": row[12],
            "total_weight": row[13],
            "item_desc": row[14],
            "handling_inst": row[15],
            "compliant": row[16],
            "created_at": row[17]
        }
        
        return jsonify(consignment), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Download commercial invoice PDF
@consignment_management.route('/download-invoice/<string:consignment_uuid>', methods=['GET'])
@token_required
def download_invoice(consignment_uuid):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT commercial_invoice, shipment_id FROM Consignments WHERE uuid = ?", (consignment_uuid,))
        result = cursor.fetchone()
        conn.close()
        
        if not result or result[0] is None:
            return jsonify({"success": False, "message": "Invoice not found"}), 404
        
        pdf_file = BytesIO(result[0])
        return send_file(
            pdf_file, 
            mimetype='application/pdf', 
            as_attachment=True, 
            download_name=f'invoice_{result[1]}.pdf'
        )
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Update consignment compliance status
@consignment_management.route('/update-compliance/<string:consignment_uuid>', methods=['PUT'])
@token_required
def update_compliance(consignment_uuid):
    try:
        data = request.json
        new_status = data.get('compliant')
        
        if new_status not in ['pending', 'compliant', 'flagged']:
            return jsonify({"success": False, "message": "Invalid compliance status"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("UPDATE Consignments SET compliant = ? WHERE uuid = ?", (new_status, consignment_uuid))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({"success": False, "message": "Consignment not found"}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({"success": True, "message": "Compliance status updated successfully"}), 200
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500 