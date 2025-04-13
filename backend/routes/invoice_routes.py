import uuid  
from flask import request, jsonify
from extensions import mail
from flask_mail import Message
from werkzeug.utils import secure_filename
from flask import current_app
import werkzeug
import os
from flask import Blueprint, request, jsonify, send_file
from extensions import db, razorpay_client
from models import Client, Invoice, InvoiceItem
from datetime import datetime
from io import BytesIO
from utils.pdf_generator import generate_invoice_pdf
from utils.num_to_words import num_to_indian_words

invoice_bp = Blueprint('invoice_bp', __name__)


@invoice_bp.route('/clients', methods=['POST'])
def add_client():
    data = request.json
    client = Client(
        name=data['name'],
        email=data.get('email'),
        address=data.get('address'),
        phone=data.get('phone'),
        city=data.get('city'),
        state=data.get('state'),
        postal_code=data.get('postal_code'),
        pan=data.get('pan'),
        gstin=data.get('gstin'),
        custom_fields=data.get('custom_fields')
    )
    db.session.add(client)
    db.session.commit()
    return jsonify({'message': 'Client added successfully'}), 201


@invoice_bp.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()
    result = [
        {
            'id': c.id,
            'name': c.name,
            'email': c.email,
            'phone': c.phone,
            'address': c.address,
            'city': c.city,
            'state': c.state,
            'postal_code': c.postal_code,
            'pan': c.pan,
            'gstin': c.gstin,
            'custom_fields': c.custom_fields
        } for c in clients
    ]
    return jsonify(result)


@invoice_bp.route('/invoices', methods=['POST'])
def add_invoice():
    data = request.json

    generated_invoice_number = data.get(
        'invoice_number') or f"INV-{uuid.uuid4().hex[:6].upper()}"

    existing = Invoice.query.filter_by(
        invoice_number=generated_invoice_number).first()
    if existing:
        return jsonify({'error': 'Invoice number already exists. Please use a different one.'}), 400

    invoice = Invoice(
        invoice_number=generated_invoice_number,
        due_date=datetime.strptime(data['due_date'], '%Y-%m-%d'),
        status=data.get('status', 'Unpaid'),
        client_id=data['client_id'],
        currency=data.get('currency', 'INR'),
        discount=data.get('discount', 0.0),
        logo_url=data.get('logo_url'),
        upi_id=data.get('upi_id'),
        signature=data.get('signature')
    )

    for item_data in data['items']:
        item = InvoiceItem(
            description=item_data['description'],
            quantity=item_data['quantity'],
            unit_price=item_data['unit_price'],
            unit=item_data.get('unit'),
            gst_rate=item_data.get('gst_rate', 0.0),
            hsn_sac=item_data.get('hsn_sac')
        )
        invoice.items.append(item)

    db.session.add(invoice)
    db.session.commit()
    return jsonify({'message': 'Invoice created successfully', 'id': invoice.id}), 201


@invoice_bp.route('/invoices', methods=['GET'])
def get_invoices():
    invoices = Invoice.query.all()
    result = []

    for inv in invoices:
        result.append({
            'id': inv.id,
            'invoice_number': inv.invoice_number,
            'date_created': inv.date_created.strftime('%Y-%m-%d'),
            'due_date': inv.due_date.strftime('%Y-%m-%d'),
            'status': inv.status,
            'currency': inv.currency,
            'discount': inv.discount,
            'upi_id': inv.upi_id,
            'signature': inv.signature,
            'client': {
                'id': inv.client.id,
                'name': inv.client.name
            },
            'items': [
                {
                    'description': item.description,
                    'quantity': item.quantity,
                    'unit_price': item.unit_price,
                    'gst_rate': item.gst_rate,
                    'hsn_sac': item.hsn_sac,
                    'unit': item.unit,
                    'total': item.total
                } for item in inv.items
            ]
        })

    return jsonify(result)


@invoice_bp.route('/invoices/<int:invoice_id>/pdf', methods=['GET'])
def download_invoice_pdf(invoice_id):
    pdf = generate_invoice_pdf(invoice_id)
    return send_file(BytesIO(pdf), download_name=f'invoice_{invoice_id}.pdf', as_attachment=True)


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}


@invoice_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    ext = filename.rsplit('.', 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Unsupported file type'}), 400

    save_path = os.path.join(current_app.root_path, UPLOAD_FOLDER)
    os.makedirs(save_path, exist_ok=True)

    filepath = os.path.join(save_path, filename)
    file.save(filepath)

    return jsonify({'url': f'/static/uploads/{filename}'}), 200


@invoice_bp.route('/clients/<int:client_id>', methods=['PUT'])
def update_client(client_id):
    client = Client.query.get_or_404(client_id)
    data = request.json

    client.name = data.get('name', client.name)
    client.email = data.get('email', client.email)
    client.phone = data.get('phone', client.phone)
    client.address = data.get('address', client.address)
    client.city = data.get('city', client.city)
    client.state = data.get('state', client.state)
    client.postal_code = data.get('postal_code', client.postal_code)
    client.pan = data.get('pan', client.pan)
    client.gstin = data.get('gstin', client.gstin)

    db.session.commit()
    return jsonify({'message': 'Client updated successfully'})


@invoice_bp.route('/clients/<int:client_id>', methods=['DELETE'])
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': 'Client deleted successfully'})


@invoice_bp.route('/send-invoice-email', methods=['POST', 'OPTIONS'])
def send_invoice_email():
    if request.method == 'OPTIONS':
        return '', 200  

    try:
        data = request.json
        print("Received email send request:", data)  

        invoice_id = data.get('invoice_id')
        if not invoice_id:
            return jsonify({'error': 'Missing invoice_id'}), 400

        invoice = Invoice.query.get(invoice_id)
        if not invoice or not invoice.client or not invoice.client.email:
            return jsonify({'error': 'Client email not found'}), 400

        pdf_buffer = generate_invoice_pdf(invoice_id)

        msg = Message(
            subject=f"Invoice #{invoice.invoice_number}",
            sender=os.getenv('MAIL_USERNAME'),  
            recipients=[invoice.client.email],
            body=f"Dear {invoice.client.name},\n\nPlease find your invoice attached.\n\nThanks!"
        )
        msg.attach(f"Invoice_{invoice.invoice_number}.pdf",
                   "application/pdf", pdf_buffer)
        mail.send(msg)

        return jsonify({'message': 'Invoice emailed successfully'}), 200

    except Exception as e:
        print("❌ Email send error:", e)
        return jsonify({'error': str(e)}), 500


@invoice_bp.route('/create-razorpay-order/<int:invoice_id>', methods=['POST'])
def create_razorpay_order(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)

    total_amount = sum(item.total for item in invoice.items)
    gst = total_amount * 0.12
    discount = total_amount * (invoice.discount or 0) / 100
    grand_total = round(total_amount + gst - discount, 2)

    amount_paise = int(grand_total * 100)  

    order = razorpay_client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"receipt_{invoice.invoice_number}",
        "payment_capture": 1
    })

    return jsonify({
        "order_id": order["id"],
        "amount": amount_paise,
        "currency": "INR",
        "invoice_id": invoice.id,
        "client_name": invoice.client.name,
        "client_email": invoice.client.email,
        "client_contact": invoice.client.phone
    })


@invoice_bp.route('/payment-success', methods=['POST'])
def payment_success():
    data = request.json
    invoice = Invoice.query.get_or_404(data['invoice_id'])
    invoice.status = "Paid"
    db.session.commit()
    return jsonify({"message": "Payment marked as paid"})


@invoice_bp.route('/razorpay/payment-link/<int:invoice_id>', methods=['POST'])
def create_payment_link(invoice_id):
    invoice = Invoice.query.get_or_404(invoice_id)
    client = invoice.client

    total_amount = sum(item.total for item in invoice.items)
    gst = total_amount * 0.12
    discount = total_amount * (invoice.discount or 0) / 100
    grand_total = round(total_amount + gst - discount, 2)

    amount_paise = int(grand_total * 100)

    payment_link = razorpay_client.payment_link.create({
        "amount": amount_paise,
        "currency": "INR",
        "accept_partial": False,
        "description": f"Payment for Invoice #{invoice.invoice_number}",
        "customer": {
            "name": client.name,
            "email": client.email,
            "contact": client.phone
        },
        "notify": {
            "sms": True,
            "email": True
        },
        "reminder_enable": True,
        "callback_url": "http://localhost:5173/invoices",
        "callback_method": "get"
    })

    return jsonify({
        "link": payment_link["short_url"],
        "invoice_id": invoice.id
    })


@invoice_bp.route('/razorpay/webhook', methods=['POST'])
def razorpay_webhook():
    import hmac
    import hashlib

    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    payload = request.data
    received_signature = request.headers.get('X-Razorpay-Signature')

    generated_signature = hmac.new(
        webhook_secret.encode(), payload, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(received_signature, generated_signature):
        return jsonify({'status': 'unauthorized'}), 401

    data = request.json
    event = data.get('event')

    payment_data = data.get("payload", {}).get(
        "payment_link", {}).get("entity", {})
    invoice_number = payment_data.get("description", "").replace(
        "Payment for Invoice #", "").strip()
    invoice = Invoice.query.filter_by(invoice_number=invoice_number).first()

    if not invoice:
        return jsonify({'error': 'Invoice not found'}), 404

    if event == "payment_link.paid":
        invoice.status = "Paid"
    elif event in ["payment_link.failed", "payment_link.expired"]:
        invoice.status = "Not Paid"

    db.session.commit()
    return jsonify({'status': 'processed'}), 200
