import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Paper, Box, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const res = await axios.get('/api/clients');
    setClients(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await axios.delete(`/api/clients/${id}`);
      fetchClients();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingClient) {
      await axios.put(`/api/clients/${editingClient.id}`, formData);
      setEditingClient(null);
    } else {
      await axios.post('/api/clients', formData);
    }
    setFormData({ name: '', email: '', address: '', phone: '' });
    fetchClients();
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || '',
      email: client.email || '',
      address: client.address || '',
      phone: client.phone || ''
    });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        {editingClient ? 'Edit Client' : 'Add Client'}
      </Typography>

      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }} elevation={3}>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth />
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
            <Button type="submit" variant="contained" fullWidth size="large">
              {editingClient ? 'Save Changes' : 'Add Client'}
            </Button>
          </Box>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>Client List</Typography>
      {clients.map((client) => (
        <Paper key={client.id} sx={{ p: 2, mb: 2 }} elevation={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>{client.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {client.email}, {client.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {client.address}
              </Typography>
            </Box>
            <Box>
              <IconButton color="primary" onClick={() => handleEdit(client)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(client.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}
    </Container>
  );
};

export default Clients;