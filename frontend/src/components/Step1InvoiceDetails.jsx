// src/components/Step1InvoiceDetails.jsx
import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import FileUploader from './FileUploader'; // ✅ Import uploader

const Step1InvoiceDetails = ({ data, updateData }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('/api/clients').then(res => setClients(res.data));
  }, []);

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const items = [...data.items];
    items[index][e.target.name] = e.target.value;
    updateData({ items });
  };

  const addItem = () => {
    updateData({ items: [...data.items, { description: '', quantity: 1, unit_price: 0 }] });
  };

  const removeItem = (index) => {
    const items = data.items.filter((_, i) => i !== index);
    updateData({ items });
  };

  return (
    <Box>
      <Typography variant="h6">Basic Info</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
        <TextField name="invoice_number" label="Invoice Number" value={data.invoice_number} onChange={handleChange} required />
        <TextField type="date" name="due_date" label="Due Date" value={data.due_date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
        <TextField select name="client_id" label="Client" value={data.client_id} onChange={handleChange} required sx={{ minWidth: 200 }}>
          <MenuItem value="">Select Client</MenuItem>
          {clients.map(client => (
            <MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="h6">Invoice Items</Typography>
      {data.items.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2, border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField label="Description" name="description" value={item.description} onChange={(e) => handleItemChange(index, e)} required />
            <TextField type="number" label="Qty" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
            <TextField type="number" label="Unit Price" name="unit_price" value={item.unit_price} onChange={(e) => handleItemChange(index, e)} required />
          </Box>

          {data.items.length > 1 && (
            <Button variant="outlined" color="error" onClick={() => removeItem(index)} sx={{ mt: 1 }}>
              Remove Item
            </Button>
          )}
        </Box>
      ))}

      <Button onClick={addItem} variant="outlined" sx={{ mt: 2 }}>+ Add Item</Button>
    </Box>
  );
};

export default Step1InvoiceDetails;
