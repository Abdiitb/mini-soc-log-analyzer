import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

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
      const res = await axios.post("http://localhost:8000/api/filter-logs-by-status/", formData, {
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
    // <div>
    //   <input type="file" accept=".log" onChange={handleFileChange} className='border-2 border-black' />
    //   <button onClick={handleUpload}>Upload Log</button>
    //   {message && <p>{message}</p>}
    // </div>
    <Form.Group controlId="formFileLg" className="mb-3 text-center">
      <Form.Label className='mb-3 text-4xl text-amber-400 quicksand-font'>Select the log file to analyze</Form.Label>
      <Form.Control type="file" size="lg" onChange={handleFileChange} />
      <Button className="m-4" size="lg" onClick={handleUpload}>Upload</Button>
      {/* <Button className="m-4" size="lg" onClick={handleAnalyze}>Analyze</Button> */}
    </Form.Group>
  );
};

export default FileUpload;