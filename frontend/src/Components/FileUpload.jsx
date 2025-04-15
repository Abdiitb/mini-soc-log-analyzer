import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload-log/", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed.");
    }
  };

  return (
    <div>
      <input type="file" accept=".log" onChange={handleFileChange} className='border-2 border-black' />
      <button onClick={handleUpload}>Upload Log</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default FileUpload;