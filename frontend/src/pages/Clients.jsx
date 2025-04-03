// src/pages/Clients.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button,
  List, ListItem, ListItemText
} from '@mui/material';

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
      fetchClients(); // refresh list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/clients', formData);
    setFormData({ name: '', email: '', address: '', phone: '' });
    fetchClients();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Add Client</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <Button type="submit" variant="contained">Add Client</Button>
      </form>
      {editingClient && (
      <form onSubmit={async (e) => {
        e.preventDefault();
        await axios.put(`/api/clients/${editingClient.id}`, editingClient);
        setEditingClient(null);
        fetchClients();
      }} style={{ marginTop: 20 }}>
        <Typography variant="h6">Edit Client</Typography>
        <TextField label="Name" value={editingClient.name} onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })} />
        <TextField label="Email" value={editingClient.email} onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })} />
        <TextField label="Phone" value={editingClient.phone} onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })} />
        <TextField label="Address" value={editingClient.address} onChange={(e) => setEditingClient({ ...editingClient, address: e.target.value })} />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>Save Changes</Button>
      </form>
    )}

      <Typography variant="h6">Client List</Typography>
      <List>
        {clients.map((client) => (
          <ListItem key={client.id} secondaryAction={
            <>
              <Button size="small" onClick={() => setEditingClient(client)}>Edit</Button>
              <Button size="small" color="error" onClick={() => handleDelete(client.id)}>Delete</Button>
            </>
            }>
            <ListItemText primary={client.name} secondary={`${client.email}, ${client.phone}`} />
          </ListItem>

        ))}
      </List>
    </Container>
  );
};

export default Clients;
