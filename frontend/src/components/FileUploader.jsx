// src/components/FileUploader.jsx
import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const FileUploader = ({ label, onUpload }) => {
  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (res.data.url) {
      onUpload(res.data.url);
    }
  };

  return (
    <Button component="label" variant="outlined">
      {label}
      <input type="file" hidden onChange={handleChange} />
    </Button>
  );
};

export default FileUploader;
