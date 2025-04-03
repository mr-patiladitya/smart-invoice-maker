# extensions.py
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import razorpay
import os
from dotenv import load_dotenv
load_dotenv()

db = SQLAlchemy()

mail = Mail()


razorpay_client = razorpay.Client(
    auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
)
