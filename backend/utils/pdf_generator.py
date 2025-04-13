import pdfkit
from flask import render_template
from models import Invoice, Client
import base64

config = pdfkit.configuration(
    wkhtmltopdf=r"C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
)

def generate_invoice_pdf(invoice_id):
    invoice = Invoice.query.get(invoice_id)
    client = Client.query.get(invoice.client_id)
    items = invoice.items

    subtotal = sum(item.quantity * item.unit_price for item in items)
    gst = round(subtotal * 0.12, 2)
    discount_percent = invoice.discount or 0
    discount_amount = round(subtotal * discount_percent / 100, 2)
    grand_total = round(subtotal + gst - discount_amount, 2)

    signature_data = None
    if invoice.signature and invoice.signature.startswith("data:image"):
        signature_data = invoice.signature

    rendered = render_template(
        "invoice_template.html",
        invoice=invoice,
        client=client,
        items=items,
        subtotal=subtotal,
        gst=gst,
        discount=discount_percent,
        discount_amount=discount_amount,
        grand_total=grand_total,
        signature=signature_data
    )

    options = {
        'enable-local-file-access': None,
        'load-error-handling': 'ignore',
        'load-media-error-handling': 'ignore',
    }

    pdf = pdfkit.from_string(rendered, False, options=options, configuration=config)
    return pdf
