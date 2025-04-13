from extensions import db
from datetime import datetime


class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    pan = db.Column(db.String(20))
    gstin = db.Column(db.String(30))
    custom_fields = db.Column(db.JSON)
    website = db.Column(db.String(120))
    industry = db.Column(db.String(100))

    invoices = db.relationship(
        'Invoice', back_populates='client', cascade="all, delete-orphan")


class Invoice(db.Model):
    __tablename__ = 'invoices'

    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(20), unique=True, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='Unpaid')

    currency = db.Column(db.String(10), default='INR')
    discount = db.Column(db.Float, default=0.0)
    logo_url = db.Column(db.String(255))
    upi_id = db.Column(db.String(100))

    signature = db.Column(db.Text) 

    client_id = db.Column(db.Integer, db.ForeignKey(
        'clients.id'), nullable=False)
    client = db.relationship('Client', back_populates='invoices')
    items = db.relationship(
        'InvoiceItem', back_populates='invoice', cascade='all, delete-orphan')


class InvoiceItem(db.Model):
    __tablename__ = 'invoice_items'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50))
    gst_rate = db.Column(db.Float, default=0.0)
    hsn_sac = db.Column(db.String(20))
    invoice_id = db.Column(db.Integer, db.ForeignKey(
        'invoices.id'), nullable=False)
    invoice = db.relationship('Invoice', back_populates='items')

    @property
    def total(self):
        base = self.quantity * self.unit_price
        tax = base * (self.gst_rate / 100)
        return round(base + tax, 2)
