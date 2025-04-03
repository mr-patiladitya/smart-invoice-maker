// src/components/LiveInvoicePreview.jsx
import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const LiveInvoicePreview = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.unit_price, 0);
  const gst = subtotal * 0.12;
  const discount = subtotal * (data.discount / 100);
  const grandTotal = (subtotal + gst - discount).toFixed(2);

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, mt: 2 }}>
      <Typography variant="subtitle1"><strong>Invoice #:</strong> {data.invoice_number}</Typography>
      <Typography variant="body2"><strong>Due:</strong> {data.due_date}</Typography>

      <Divider sx={{ my: 1 }} />

      <Typography variant="body1"><strong>Items:</strong></Typography>
      <ul>
        {data.items.map((item, index) => (
          <li key={index}>
            {item.description} - Qty: {item.quantity}, ₹{item.unit_price} (12% GST)
          </li>
        ))}
      </ul>

      <Typography variant="body2">Subtotal: ₹{subtotal.toFixed(2)}</Typography>
      <Typography variant="body2">GST (12%): ₹{gst.toFixed(2)}</Typography>
      <Typography variant="body2">Discount ({data.discount}%): ₹{discount.toFixed(2)}</Typography>

      <Divider sx={{ my: 1 }} />
      <Typography variant="h6"><strong>Total:</strong> ₹{grandTotal}</Typography>

      {data.upi_id && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Pay via UPI:</strong> {data.upi_id}
        </Typography>
      )}

      {data.signature && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2"><strong>Signature:</strong></Typography>
          <img
            src={data.signature}
            alt="Signature Preview"
            style={{ width: 200, height: 'auto', border: '1px solid #999', backgroundColor: '#fff' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default LiveInvoicePreview;
